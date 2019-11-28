import React, { useState, useEffect, Fragment, useRef } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ImageBackground } from 'react-native';
import { TouchFeedback, Button, SubmitLoading, TipsOverlay, ItemSeparator, Row, Iconfont } from 'components';
import { useQuery, GQL, useMutation } from 'apollo';
import { app, config } from 'store';
import { Theme, PxFit, SCREEN_WIDTH, WPercent, Tools, ISAndroid, NAVBAR_HEIGHT } from 'utils';
import { playVideo, bindWechat, checkUserInfo } from 'common';
import { ttad } from 'native';

import WithdrawGuidance from './WithdrawGuidance';
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

    const createWithdraw = async value => {
        setSubmit(true);
        try {
            const result = await app.client.mutate({
                mutation: GQL.CreateWithdrawMutation,
                variables: {
                    amount: value,
                    platform: withdrawType,
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
            createWithdraw(value);
        }
    };

    const renderBindTips = () => {
        if (withdrawType === 'alipay' && Tools.syncGetter('wallet.platforms.alipay', user)) {
            return null;
        }
        console.log('Tools.syncGetter :', Tools.syncGetter('wallet.platforms.wechat', user));
        if (withdrawType === 'wechat' && Tools.syncGetter('data.user.wallet.platforms.wechat', UserMeansQuery)) {
            return null;
        }
        return (
            <Row style={{ justifyContent: 'space-between', marginTop: PxFit(10), marginBottom: PxFit(5) }}>
                <Text style={{ fontSize: PxFit(13) }}>{`绑定${
                    withdrawType == 'alipay' ? '支付宝' : '微信'
                }后可直接提现`}</Text>
                <TouchFeedback
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                        if (withdrawType == 'alipay') {
                            checkUserInfo();
                        } else {
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
                                    Toast.show({ content: error.toString().replace(/Error: GraphQL error: /, '') });
                                },
                            });
                        }
                    }}>
                    <Text style={{ fontSize: PxFit(13), color: Theme.subTextColor }}>立即绑定</Text>
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
    ];
    console.log('withdrawData user :', user);
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
                    <Row style={{ marginTop: PxFit(10) }}>
                        {WithdrawType.map((data, index) => {
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
        width: (SCREEN_WIDTH - 40) / 2,
        height: PxFit(50),
        justifyContent: 'center',
        borderColor: Theme.borderColor,
        borderWidth: PxFit(0.5),
        borderRadius: PxFit(5),
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
