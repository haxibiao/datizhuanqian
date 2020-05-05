import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, AppState } from 'react-native';
import { TouchFeedback, Button, SubmitLoading, Row, Iconfont } from 'components';
import { useQuery, GQL } from 'apollo';
import { app, observer } from 'store';
import { getAuthCode } from 'common';
import { DownloadApkIntro, ErrorOverlay } from 'components';
import { AppUtil } from 'native';
import WithdrawHeader from './WithdrawHeader';
import WithdrawBottom from './WithdrawBottom';
import DameiIntro from './DameiIntro';
import { withdrawTrack } from 'common';
import { NavigationActions } from 'react-navigation';

import DeviceInfo from 'react-native-device-info';
const SystemVersion = DeviceInfo.getSystemVersion();
const Brand = DeviceInfo.getBrand();

const WithdrawBody = observer(props => {
    const { navigation, withdrawClient } = props;
    const [submit, setSubmit] = useState(false);
    const [withdrawType, setWithdrawType] = useState('wechat');

    const [installDDZ, setInstallDDZ] = useState(false);
    const [installDM, setInstallDM] = useState(false);
    const [selectWithdraw, setSelectWithdraw] = useState({ amount: 0, rule: null, needContributes: 0 });

    const UserMeansQuery = useQuery(GQL.UserMeansQuery, {
        variables: { id: app.me.id },
    });

    let user = Helper.syncGetter('data.user', UserMeansQuery);

    const { data, loading, error, refetch } = useQuery(GQL.withdrawInfoQuery, {
        variables: { id: app.me.id },
    });

    let withdraw = Helper.syncGetter('user', data);

    useEffect(() => {
        const navDidFocusListener = props.navigation.addListener('didFocus', () => {
            UserMeansQuery.refetch();
            refetch();
        });
        return () => {
            navDidFocusListener.remove();
        };
    }, [UserMeansQuery.loading, UserMeansQuery.refetch, refetch]);

    const CheckApkExist = useCallback(
        event => {
            if (event === 'active') {
                AppUtil.CheckApkExist('com.dongdezhuan', (data: any) => {
                    if (data) {
                        setInstallDDZ(true);
                    }
                });
                AppUtil.CheckApkExist('com.damei', (data: any) => {
                    if (data) {
                        setInstallDM(true);
                    }
                });
            }
        },
        [installDM],
    );

    const deviceCheck = () => {
        if (SystemVersion == '10' && Brand == 'huawei') {
            WithdrawType.splice(2, 2);
        }
    };

    const createWithdraw = useCallback(
        async (type?: any) => {
            setSubmit(true);
            console.log('selectWithdraw :>> ', selectWithdraw);
            try {
                const result = await withdrawClient.mutate({
                    mutation: GQL.CreateWithdrawMutation,
                    variables: {
                        amount: selectWithdraw.amount,
                        platform: type || withdrawType,
                        version: Config.Version,
                    },
                    refetchQueries: () => [
                        {
                            query: GQL.UserMeansQuery,
                            variables: { id: app.me.id },
                        },
                        {
                            query: GQL.WithdrawsQuery,
                        },
                    ],
                });
                navigation.navigate('WithdrawApply', { amount: selectWithdraw.amount });
                setSubmit(false);
            } catch (e) {
                let str = e.toString().replace(/Error: GraphQL error: /, '');
                Toast.show({ content: str });
                setSubmit(false);
            }
        },
        [withdrawType, selectWithdraw],
    );

    const handleWithdraw = () => {
        //matomo提现统计
        withdrawTrack({
            withdrawType,
            value: selectWithdraw.amount.toString(),
        });

        //检查余额
        if (!selectWithdraw.amount) {
            Toast.show({
                content: `请选择金额！`,
            });
            return;
        }

        //检查余额
        if (user.gold < selectWithdraw.amount * user.exchange_rate) {
            Toast.show({
                content: `智慧点不足提现${selectWithdraw.amount}元，快去赚钱智慧点吧`,
            });
            return;
        }

        //检查贡献值
        if (selectWithdraw.needContributes > user.today_contributes) {
            ErrorOverlay.show({
                title: `提现${selectWithdraw.amount}元失败`,
                content: `今日贡献值不足,还差${selectWithdraw.needContributes - user.today_contributes}贡献值即可提现`,
                buttonName: '做贡献任务',
                action: () => {
                    const resetAction = NavigationActions.navigate({
                        routeName: '任务',
                        params: {
                            showGuidance: true,
                        },
                    });
                    navigation.dispatch(resetAction);
                },
            });
            return;
        }

        //检查提现类型
        if (withdrawType === 'dongdezhuan' && !installDDZ) {
            DownloadApkIntro.show(createWithdraw, selectWithdraw.amount);
            return;
        }
        if (withdrawType === 'damei' && !installDM) {
            DameiIntro.show(installDM);
            return;
        }

        //提现
        createWithdraw();
    };

    useEffect(() => {
        AppState.addEventListener('change', CheckApkExist);
        deviceCheck();
        return () => {
            AppState.removeEventListener('change', CheckApkExist);
        };
    }, [CheckApkExist]);

    const renderBindTips = () => {
        let name = '已绑定';
        let action = () => {
            Helper.middlewareNavigate('AccountSecurity', { user: Object.assign({}, user, { ...withdraw }) });
        };
        let playform = '懂得赚';

        if (withdrawType === 'alipay' && !Helper.syncGetter('user.wallet.bind_platforms.alipay', data)) {
            name = '立即绑定';
            action = () => Helper.middlewareNavigate('SettingWithdrawInfo');
        }
        if ((withdrawType === 'wechat' && !Helper.syncGetter('user.wallet.platforms.wechat', data)) || Device.IOS) {
            name = '立即绑定';
            action = () => {
                setSubmit(true);
                getAuthCode({
                    onSuccess: () => {
                        setSubmit(false);
                        Toast.show({
                            content: '绑定成功',
                        });
                    },
                    onFailed: (error: { toString: () => any }) => {
                        setSubmit(false);
                    },
                });
            };
        }

        switch (withdrawType) {
            case 'wechat':
                playform = '微信';
                break;
            case 'alipay':
                playform = '支付宝';
                break;
            case 'damei':
                playform = '答妹';
                break;
            default:
                playform = '懂得赚';
                break;
        }
        return (
            <Row style={{ justifyContent: 'space-between', marginTop: PxFit(12), marginBottom: PxFit(5) }}>
                {playform === '懂得赚' || playform === '答妹' ? (
                    <TouchFeedback
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => {
                            console.log('installDM', installDM);
                            playform === '懂得赚' ? DownloadApkIntro.show() : DameiIntro.show(installDM);
                        }}>
                        <Text style={{ fontSize: Font(13) }}>
                            {`绑定`}
                            <Text style={{ color: Theme.theme }}>{playform}</Text>后可直接提现哦
                        </Text>
                        <Image
                            source={require('@src/assets/images/question.png')}
                            style={{ width: PxFit(12), height: PxFit(12), marginLeft: PxFit(3) }}
                        />
                    </TouchFeedback>
                ) : (
                    <Text
                        style={{
                            fontSize: Font(13),
                            color: '#606060',
                        }}>{`绑定${playform}后可直接提现哦`}</Text>
                )}

                <TouchFeedback style={{ flexDirection: 'row', alignItems: 'center' }} onPress={action}>
                    <Text style={{ fontSize: PxFit(13), color: '#999999' }}>{name}</Text>
                    <Iconfont name="right" size={PxFit(13)} color={'#999999'} />
                </TouchFeedback>
            </Row>
        );
    };

    if (!user) {
        if (app && app.userCache) {
            user = app.userCache;
        } else {
            return null;
        }
    }
    console.log('withdrawB :', withdraw);
    return (
        <>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <WithdrawHeader navigation={navigation} user={user} />

                    <View style={{ paddingHorizontal: PxFit(Theme.itemSpace), marginTop: PxFit(10) }}>
                        <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {WithdrawType.map((data, index) => {
                                if (Device.IOS && data.type === 'wechat') return null;
                                return (
                                    <Fragment key={index}>
                                        <TouchFeedback
                                            style={[
                                                styles.withdrawType,
                                                withdrawType === data.type && {
                                                    borderColor: '#FECF3F',
                                                },
                                            ]}
                                            onPress={() => {
                                                setWithdrawType(data.type);
                                            }}>
                                            <Image source={data.icon} style={styles.withdrawTypeText} />
                                            <Text>{data.name}</Text>
                                            {withdrawType === data.type && (
                                                <Image
                                                    source={require('@src/assets/images/bg_withdraw_type_selected.png')}
                                                    style={{
                                                        width: PxFit(20),
                                                        height: (PxFit(20) * 80) / 94,
                                                        position: 'absolute',
                                                        right: 0,
                                                        bottom: 0,
                                                    }}
                                                />
                                            )}
                                        </TouchFeedback>
                                    </Fragment>
                                );
                            })}
                        </Row>
                        {renderBindTips()}
                    </View>
                    <WithdrawBottom
                        setSelectWithdraw={setSelectWithdraw}
                        selectWithdraw={selectWithdraw}
                        navigation={navigation}
                        withdraw={withdraw}
                    />
                    <SubmitLoading isVisible={submit} content={'加载中...'} />
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <Button
                    title={'立即提现'}
                    style={styles.button}
                    onPress={handleWithdraw}
                    FontSize={Font(15)}
                    textColor={'#623605'}
                />
            </View>
        </>
    );
});

const WithdrawType = [
    {
        type: 'wechat',
        name: '微信',
        icon: require('@src/assets/images/wechat.png'),
    },
    {
        type: 'alipay',
        name: '支付宝',
        icon: require('@src/assets/images/zhifubao.png'),
    },
    {
        type: 'damei',
        name: '答妹',
        icon: require('@src/assets/images/ic_damei.png'),
    },
    {
        type: 'dongdezhuan',
        name: '懂得赚',
        icon: require('@src/assets/images/ic_dongdezhuan.png'),
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: 100,
    },
    slenderBlackText: {
        textAlign: 'center',
        color: Theme.defaultTextColor,
        fontSize: PxFit(17),
        fontWeight: '300',
        lineHeight: PxFit(18),
        marginTop: PxFit(10),
    },

    boldBlackText: {
        textAlign: 'center',
        color: Theme.secondaryColor,
        fontSize: PxFit(30),
        fontWeight: '500',
        lineHeight: PxFit(32),
        marginBottom: PxFit(5),
        marginTop: PxFit(15),
    },

    withdrawType: {
        flexDirection: 'row',
        alignItems: 'center',
        width: (Device.WIDTH - PxFit(40)) * 0.49,
        height: PxFit(50),
        justifyContent: 'center',
        borderColor: Theme.borderColor,
        borderWidth: PxFit(0.5),
        borderRadius: PxFit(5),
        marginTop: PxFit(10),
    },
    withdrawTypeText: {
        width: PxFit(24),
        height: PxFit(24),
        marginRight: PxFit(5),
    },
    footer: {
        alignItems: 'center',
        paddingVertical: PxFit(15),
    },
    tips: {
        color: '#A3A3A3',
        fontSize: Font(14),
        lineHeight: PxFit(18),
        textAlign: 'center',
    },
    button: {
        height: PxFit(44),
        borderRadius: PxFit(22),
        backgroundColor: '#FCE13D',
        width: Percent(88),
    },
});

export default WithdrawBody;
