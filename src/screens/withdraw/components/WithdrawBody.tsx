import React, { useState, useEffect, Fragment } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { TouchFeedback, Button, SubmitLoading, TipsOverlay, ItemSeparator, Row, Iconfont } from 'components';
import { useQuery, GQL, useMutation } from 'apollo';
import { app, config } from 'store';
import { Theme, PxFit, SCREEN_WIDTH, WPercent, Tools, ISAndroid } from 'utils';
import { playVideo } from 'common';
import { ttad } from 'native';

import WithdrawGuidance from './WithdrawGuidance';

const WithdrawCount = [1, 3, 5, 10];

const WithdrawBody = props => {
    const { navigation } = props;
    const [submit, setSubmit] = useState(false);
    const [withdrawType, setWithdrawType] = useState('alipay');
    const [withdrawCount, setWithdrawCount] = useState(0);

    const UserMeansQuery = useQuery(GQL.UserMeansQuery, {
        variables: { id: app.me.id },
    });

    let user = Tools.syncGetter('data.user', UserMeansQuery);

    const [createWithdrawal] = useMutation(GQL.CreateWithdrawMutation, {
        variables: {
            amount: withdrawCount,
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

    useEffect(() => {
        const navDidFocusListener = props.navigation.addListener('didFocus', (payload: any) => {
            UserMeansQuery.refetch();
        });
        return () => {
            navDidFocusListener.remove();
        };
    }, [UserMeansQuery.loading]);

    const handleWithdraws = async () => {
        if (user.today_withdraw_left < withdrawCount && withdrawCount > 1) {
            TipsOverlay.show({
                title: '日贡献不足',
                content: <View>{config.enableBanner && <ttad.FeedAd adWidth={SCREEN_WIDTH - PxFit(40)} />}</View>,
                onConfirm: () => {
                    navigation.navigate('任务');
                    playVideo({ navigation, type: 'Task' });
                    TipsOverlay.hide();
                },
            });
        } else {
            createWithdraw();
        }
    };

    const createWithdraw = async () => {
        setSubmit(true);
        try {
            const result = await createWithdrawal();
            navigation.navigate('WithdrawApply', { amount: withdrawCount });
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
            setWithdrawCount(value);
        }
    };

    const WithdrawType = [
        {
            type: 'alipay',
            name: '支付宝',
            icon: require('@src/assets/images/alipay.png'),
            withdrawInfo: Tools.syncGetter('data.user.wallet.platforms.alipay', UserMeansQuery),
        },
        {
            type: 'wechat',
            name: '微信',
            icon: require('@src/assets/images/wechat.png'),
            withdrawInfo: Tools.syncGetter('data.user.wallet.platforms.wechat', UserMeansQuery),
        },
    ];
    const { userCache } = app;
    if (!user) {
        if (userCache) {
            user = userCache;
        } else {
            user = app.me;
        }
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.statistics}>
                    <View>
                        <Text style={styles.greyText}>当前智慧点(个)</Text>
                        <Text style={styles.boldBlackText}>{user.gold || 0}</Text>
                    </View>
                    <View style={styles.accumulat}>
                        <View style={styles.accumulated}>
                            <Text style={styles.greyText}>今日可提现额度(元)</Text>
                            <Text style={styles.slenderBlackText}>{user.today_withdraw_left || 0}</Text>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.accumulated}>
                            <Text style={styles.greyText}>当前汇率(智慧点/元)</Text>
                            <Text style={styles.slenderBlackText}>
                                {user.exchange_rate ? user.exchange_rate : 600}/1
                            </Text>
                        </View>
                    </View>
                </View>
                <ItemSeparator />
                <View style={{ paddingHorizontal: PxFit(Theme.itemSpace), paddingTop: PxFit(Theme.itemSpace) }}>
                    <Row>
                        <View style={styles.titleBadge}></View>
                        <Text style={{ fontSize: PxFit(15) }}>提现到</Text>
                    </Row>
                    <Row style={{ marginTop: PxFit(10) }}>
                        {WithdrawType.map((data, index) => {
                            return (
                                <Fragment>
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
                                        }}
                                        key={index}>
                                        <Image source={data.icon} style={styles.withdrawTypeText} />
                                        <Text>{data.name}</Text>
                                    </TouchFeedback>
                                    {data.withdrawInfo && (
                                        <Row style={{ justifyContent: 'space-between', marginTop: PxFit(10) }}>
                                            <Text>{`绑定${data.name}后可直接提现`}</Text>
                                            <TouchFeedback style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontSize: PxFit(13), color: Theme.subTextColor }}>
                                                    立即绑定
                                                </Text>
                                                <Iconfont name='right' size={PxFit(13)} color={Theme.subTextColor} />
                                            </TouchFeedback>
                                        </Row>
                                    )}
                                </Fragment>
                            );
                        })}
                    </Row>

                    <Row style={{ marginTop: PxFit(15) }}>
                        <View style={styles.titleBadge}></View>
                        <Text style={{ fontSize: PxFit(15) }}>提现金额</Text>
                    </Row>
                </View>
                <View style={styles.withdraws}>
                    <View style={styles.center}>
                        {WithdrawCount.map((value, index) => {
                            return (
                                <View key={index}>
                                    <TouchFeedback
                                        style={[
                                            styles.withdrawItem,
                                            withdrawCount === value && {
                                                backgroundColor: '#FFF2EB',
                                            },
                                        ]}
                                        onPress={() => selectWithdrawCount(value)}>
                                        <Text
                                            style={[
                                                styles.content,
                                                withdrawCount === value && {
                                                    color: Theme.themeRed,
                                                },
                                            ]}>
                                            {value}元
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: value === 1 ? '#FFA200' : Theme.subTextColor,
                                            }}>
                                            {value === 1 ? '新人无门槛' : `${value * 36}日贡献`}
                                        </Text>
                                    </TouchFeedback>

                                    <View
                                        style={[
                                            styles.badge,
                                            {
                                                backgroundColor: value === 1 ? Theme.themeRed : Theme.primaryColor,
                                            },
                                        ]}>
                                        <Text style={styles.badgeText}>{value === 1 ? '秒到账' : '限量抢'}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {user.wallet && user.wallet.pay_account ? (
                        <View style={styles.footer}>
                            <TouchFeedback
                                style={{ flexDirection: 'row', alignItems: 'center' }}
                                onPress={() => navigation.navigate('Introduce')}>
                                <Text style={styles.tips}>
                                    总提现{user.wallet.total_withdraw_amount || 0}.00 / 今日贡献
                                    {user.today_contributes}{' '}
                                </Text>
                                <Image
                                    source={require('../../../assets/images/question.png')}
                                    style={{ width: 11, height: 11 }}
                                />
                            </TouchFeedback>
                            <Button
                                title={'立即提现'}
                                style={styles.button}
                                disabled={withdrawCount < 1}
                                onPress={handleWithdraws}
                            />
                        </View>
                    ) : (
                        <WithdrawGuidance user={user} />
                    )}
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
    statistics: {
        marginBottom: PxFit(10),
        marginTop: PxFit(10),
    },
    greyText: {
        textAlign: 'center',
        color: Theme.subTextColor,
        fontSize: PxFit(13),
    },
    accumulat: {
        flexDirection: 'row',
        marginVertical: PxFit(10),
    },
    accumulated: {
        flex: 1,
        justifyContent: 'center',
    },
    slenderBlackText: {
        textAlign: 'center',
        color: Theme.defaultTextColor,
        fontSize: PxFit(17),
        fontWeight: '300',
        lineHeight: PxFit(18),
        marginTop: PxFit(10),
    },
    line: {
        alignSelf: 'stretch',
        backgroundColor: '#f0f0f0',
        width: PxFit(1),
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
        paddingTop: PxFit(30),
    },
    tips: {
        color: Theme.grey,
        fontSize: PxFit(12),
        lineHeight: PxFit(18),
        paddingVertical: PxFit(10),
        textAlign: 'center',
    },
    button: {
        height: PxFit(38),
        borderRadius: PxFit(19),
        backgroundColor: Theme.primaryColor,
        width: WPercent(80),
    },
});

export default WithdrawBody;
