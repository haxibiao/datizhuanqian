import React, { useState, useEffect, Fragment, useRef } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ImageBackground } from 'react-native';
import { TouchFeedback, Button, SubmitLoading, TipsOverlay, ItemSeparator, Row, Iconfont } from 'components';
import { useQuery, GQL, useMutation } from 'apollo';
import { app, config } from 'store';
import { Theme, PxFit, SCREEN_WIDTH, WPercent, Tools, ISAndroid, NAVBAR_HEIGHT, ISIOS } from 'utils';
import { playVideo, bindWechat, checkUserInfo } from 'common';
import { ad } from 'native';
import DownloadApkIntro from './DownloadApkIntro';

import { AppUtil } from 'native';

import WithdrawHeader from './WithdrawHeader';

const withdrawData = [
    {
        tips: '秒到账',
        amount: 1,
        description: '新人无门槛',
        fontColor: '#FFA200',
        bgColor: Theme.themeRed,
    },
    {
        tips: '限量抢',
        amount: 3,
        description: '108日贡献',
        fontColor: Theme.subTextColor,
        bgColor: Theme.primaryColor,
    },
    {
        tips: '限量抢',
        amount: 5,
        description: '180日贡献',
        fontColor: Theme.subTextColor,
        bgColor: Theme.primaryColor,
    },
    {
        tips: '限量抢',
        amount: 10,
        description: '360日贡献',
        fontColor: Theme.subTextColor,
        bgColor: Theme.primaryColor,
    },
];

const WithdrawBody = props => {
    const { navigation } = props;
    const [submit, setSubmit] = useState(false);
    const [withdrawType, setWithdrawType] = useState('alipay');
    const [withdrawInfo, setwithdrawInfo] = useState(withdrawData);
    const [installDDZ, setInstallDDZ] = useState(false);
    let forceAlert = true;

    const UserMeansQuery = useQuery(GQL.UserMeansQuery, {
        variables: { id: app.me.id },
    });

    let user = Tools.syncGetter('data.user', UserMeansQuery);

    useEffect(() => {
        if (UserMeansQuery.data && UserMeansQuery.data.user) {
            setwithdrawInfo(Tools.syncGetter('data.user.withdrawInfo', UserMeansQuery));
        }
    }, [UserMeansQuery.loading, UserMeansQuery.refetch]);

    useEffect(() => {
        const navDidFocusListener = props.navigation.addListener('didFocus', (payload: any) => {
            UserMeansQuery.refetch();
        });
        return () => {
            navDidFocusListener.remove();
        };
    }, [UserMeansQuery.loading, UserMeansQuery.refetch]);

    useEffect(() => {
        AppUtil.CheckApkExist('com.dongdezhuan', (data: any) => {
            if (data) {
                setInstallDDZ(true);
            }
        });
    }, []);

    const createWithdraw = async (value: any, type?: any) => {
        setSubmit(true);

        try {
            const result = await app.client.mutate({
                mutation: GQL.CreateWithdrawMutation,
                variables: {
                    amount: value,
                    platform: type || withdrawType,
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

            navigation.navigate('WithdrawApply', { amount: value });
            setSubmit(false);
        } catch (e) {
            let str = e.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
            setSubmit(false);
        }
    };

    const selectWithdrawCount = (value: number) => {
        if (user.gold < value * user.exchange_rate) {
            Toast.show({
                content: `智慧点不足提现${value}元，快去赚钱智慧点吧`,
            });
        } else {
            // createWithdraw(value);
            checkWithdrawType(value);
        }
    };

    const checkWithdrawType = (value: any) => {
        forceAlert = user ? user.force_alert : forceAlert;
        if (forceAlert && withdrawType !== 'dongdezhuan') {
            DownloadApkIntro.show(createWithdraw, value);
        } else if (withdrawType === 'dongdezhuan' && !installDDZ) {
            DownloadApkIntro.show(createWithdraw, value);
        } else {
            createWithdraw(value);
        }
    };

    const renderBindTips = () => {
        let name = '已绑定';
        let action = () => {
            navigation.navigate('AccountSecurity', { user });
        };
        let playform = '懂得赚';

        if (withdrawType === 'alipay' && !Tools.syncGetter('wallet.bind_platforms.alipay', user)) {
            name = '立即绑定';
            action = () => checkUserInfo();
        }
        if (
            (withdrawType === 'wechat' && !Tools.syncGetter('data.user.wallet.platforms.wechat', UserMeansQuery)) ||
            ISIOS
        ) {
            name = '立即绑定';
            action = () => {
                setSubmit(true);
                bindWechat({
                    onSuccess: () => {
                        setSubmit(false);
                        Toast.show({
                            content: '绑定成功',
                        });
                    },
                    onFailed: (error: { message: any }[]) => {
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
            default:
                playform = '懂得赚';
                break;
        }
        return (
            <Row style={{ justifyContent: 'space-between', marginTop: PxFit(10), marginBottom: PxFit(5) }}>
                {playform === '懂得赚' ? (
                    <TouchFeedback
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => {
                            DownloadApkIntro.show();
                        }}>
                        <Text style={{ fontSize: PxFit(13) }}>
                            {`绑定`}
                            <Text style={{ color: Theme.theme }}>{playform}</Text>后可直接提现
                        </Text>
                        <Image
                            source={require('../../../assets/images/question.png')}
                            style={{ width: PxFit(12), height: PxFit(12), marginLeft: PxFit(3) }}
                        />
                    </TouchFeedback>
                ) : (
                    <Text style={{ fontSize: PxFit(13) }}>{`绑定${playform}后可直接提现`}</Text>
                )}

                <TouchFeedback style={{ flexDirection: 'row', alignItems: 'center' }} onPress={action}>
                    <Text style={{ fontSize: PxFit(13), color: Theme.subTextColor }}>{name}</Text>
                    <Iconfont name="right" size={PxFit(13)} color={Theme.subTextColor} />
                </TouchFeedback>
            </Row>
        );
    };

    const WithdrawType = [
        {
            type: 'alipay',
            name: '支付宝',
            icon: require('@src/assets/images/zhifubao.png'),
        },
        {
            type: 'wechat',
            name: '微信',
            icon: require('@src/assets/images/wechat.png'),
        },
        {
            type: 'dongdezhuan',
            name: '懂得赚',
            icon: require('@src/assets/images/dongdezhuan.png'),
        },
    ];

    if (!user) {
        console.log('userCache :', app.userCache);
        if (app && app.userCache) {
            user = app.userCache;
        } else {
            return null;
        }
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
                <WithdrawHeader navigation={navigation} user={user} />

                <View style={{ paddingHorizontal: PxFit(Theme.itemSpace) }}>
                    <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {WithdrawType.map((data, index) => {
                            if (ISIOS && data.type === 'wechat') return null;
                            return (
                                <Fragment key={index}>
                                    <TouchFeedback
                                        style={[
                                            styles.withdrawType,
                                            withdrawType === data.type && { borderColor: Theme.primaryColor },
                                            index === 0 && {
                                                marginRight: PxFit(10),
                                            },
                                        ]}
                                        onPress={() => {
                                            setWithdrawType(data.type);
                                        }}>
                                        <Image source={data.icon} style={styles.withdrawTypeText} />
                                        <Text>{data.name}</Text>
                                    </TouchFeedback>
                                </Fragment>
                            );
                        })}
                    </Row>
                    {renderBindTips()}
                    <Row style={{ justifyContent: 'space-between', marginTop: PxFit(15) }}>
                        <Row>
                            <View style={styles.titleBadge}></View>
                            <Text style={{ fontSize: PxFit(15) }}>提现金额</Text>
                        </Row>
                        <Text style={styles.tips}>
                            总提现:{Tools.syncGetter('wallet.total_withdraw_amount', user) || 0}（元）
                        </Text>
                    </Row>
                </View>
                <View style={styles.withdraws}>
                    <View style={styles.center}>
                        {withdrawInfo.map((data, index) => {
                            return (
                                <View key={index}>
                                    <TouchFeedback
                                        style={[styles.withdrawItem]}
                                        onPress={() => {
                                            selectWithdrawCount(data.amount);
                                        }}>
                                        <Text style={[styles.content]}>{data.amount}元</Text>
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: data.fontColor,
                                            }}>
                                            {data.description}
                                        </Text>
                                    </TouchFeedback>

                                    <View
                                        style={[
                                            styles.badge,
                                            {
                                                backgroundColor: data.bgColor,
                                            },
                                        ]}>
                                        <Text style={styles.badgeText}>{data.tips}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    <View style={styles.footer}>
                        <Button
                            title={'提现日志'}
                            style={styles.button}
                            onPress={() => navigation.navigate('BillingRecord')}
                        />
                    </View>
                </View>
                <SubmitLoading isVisible={submit} content={'加载中...'} />
            </View>
        </ScrollView>
    );
};

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
    titleBadge: {
        height: 16,
        width: 3,
        backgroundColor: Theme.primaryColor,
        marginRight: PxFit(10),
    },
    withdrawType: {
        flexDirection: 'row',
        alignItems: 'center',
        width: (SCREEN_WIDTH - PxFit(40)) / 2,
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
    withdraws: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: PxFit(15),
    },
    content: {
        color: Theme.black,
        fontSize: PxFit(15),
    },
    center: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    badge: {
        alignItems: 'center',
        borderBottomRightRadius: PxFit(9),
        borderTopLeftRadius: PxFit(5),
        borderTopRightRadius: PxFit(9),
        height: 18,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        top: 0,
        width: 56,
    },
    badgeText: {
        color: '#FFF',
        fontSize: PxFit(12),
        fontWeight: '500',
    },
    withdrawItem: {
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: PxFit(5),
        height: PxFit(60),
        justifyContent: 'center',
        marginBottom: PxFit(Theme.itemSpace),
        width: (SCREEN_WIDTH - PxFit(Theme.itemSpace * 3)) / 2,
    },
    footer: {
        alignItems: 'center',
        paddingTop: PxFit(50),
    },
    tips: {
        color: Theme.grey,
        fontSize: PxFit(13),
        lineHeight: PxFit(18),
        textAlign: 'center',
    },
    button: {
        height: PxFit(38),
        borderRadius: PxFit(5),
        backgroundColor: Theme.primaryColor,
        width: WPercent(90),
    },
});

export default WithdrawBody;
