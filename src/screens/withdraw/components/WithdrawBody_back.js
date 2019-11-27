/*
 * @Author: Gaoxuan
 * @Date:   2019-04-17 15:58:44
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { TouchFeedback, Button, SubmitLoading, TipsOverlay, ItemSeparator, Row } from 'components';

import { Theme, PxFit, SCREEN_WIDTH, WPercent, Tools, ISAndroid } from 'utils';

import { compose, graphql, GQL } from 'apollo';
import { app, config } from 'store';

import { ttad } from 'native';
import { playVideo } from 'common';

import WithdrawGuidance from './WithdrawGuidance';

class WithdrawBody extends Component {
    constructor(props) {
        super(props);
        this.handleWithdraws = this.handleWithdraws.bind(this);
        this.state = {
            clickControl: false,
            isVisible: false,
            userCache: {
                gold: 0,
            },
            withdrawType: 'alipay',
            widthdrawCount: 1,
            luckyMoney: [
                {
                    id: 1,
                    value: 1,
                },
                {
                    id: 2,
                    value: 3,
                },
                {
                    id: 3,
                    value: 5,
                },
                {
                    id: 4,
                    value: 10,
                },
            ],
        };
    }

    componentDidUpdate(nextProps, nextState) {
        if (nextProps.data && nextProps.data.user) {
            nextProps.navigation.addListener('didFocus', () => {
                nextProps.data.refetch();
            });
        }
    }

    // 发起提现请求
    async handleWithdraws(amount) {
        const { data, navigation } = this.props;
        if (data.user.today_withdraw_left < amount && amount > 1) {
            TipsOverlay.show({
                title: '日贡献不足',
                content: <View>{config.enableBanner && <ttad.FeedAd adWidth={SCREEN_WIDTH - PxFit(40)} />}</View>,
                onConfirm: () => {
                    navigation.navigate('任务');
                    playVideo({ navigation, type: 'Task' });
                    TipsOverlay.hide();
                },
            });
            // navigation.navigate('WithdrawApply', { amount: 1 });
        } else {
            this.this.createWithdraw(amount);
        }

        // if(data.user.wallet)
    }

    async createWithdraw(amount) {
        const user_id = app.me.id;
        let result = {};

        this.setState({
            isVisible: true,
        });

        try {
            result = await this.props.CreateWithdrawMutation({
                variables: {
                    amount: amount,
                },
                refetchQueries: () => [
                    {
                        query: GQL.UserMeansQuery,
                        variables: { id: user_id },
                    },
                    {
                        query: GQL.WithdrawsQuery,
                    },
                ],
            });
        } catch (ex) {
            result.errors = ex;
        }
        if (result && result.errors) {
            const str = result.errors.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
            this.setState({
                clickControl: false,
            });
            this.setState({
                isVisible: false,
            });
        } else {
            this.props.navigation.navigate('WithdrawApply', { amount });
            this.setState({
                clickControl: false,
            });
            this.setState({
                isVisible: false,
            });
        }
    }

    calcExchange(user, value) {
        return user.today_withdraw_left >= value;
    }

    render() {
        const { data, navigation } = this.props;
        const { isVisible, luckyMoney } = this.state;
        const { userCache } = app;
        let user = Tools.syncGetter('user', data);

        if (!user) {
            if (userCache) {
                user = userCache;
            } else {
                return null;
            }
        }

        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.statistics}>
                        <View style={styles.currentGold}>
                            <Text style={styles.greyText1}>当前智慧点(个)</Text>
                            <Text style={styles.boldBlackText}>{user.gold || 0}</Text>
                        </View>
                        <View style={styles.accumulat}>
                            <View style={styles.accumulated}>
                                <Text style={styles.greyText2}>今日可提现额度(元)</Text>
                                <Text style={styles.slenderBlackText}>{user.today_withdraw_left || 0}</Text>
                            </View>
                            <View style={styles.line} />
                            <View style={styles.accumulated}>
                                <Text style={styles.greyText2}>当前汇率(智慧点/元)</Text>
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
                            <Row style={styles.type}>
                                <Image
                                    source={require('@src/assets/images/wechat.png')}
                                    style={styles.withdrawTypeText}
                                />
                                <Text>微信</Text>
                            </Row>
                            <Row style={[styles.type, { marginLeft: PxFit(10) }]}>
                                <Image
                                    source={require('@src/assets/images/alipay.png')}
                                    style={styles.withdrawTypeText}
                                />
                                <Text>支付宝</Text>
                            </Row>
                        </Row>
                        <Row style={{ marginTop: PxFit(15) }}>
                            <View style={styles.titleBadge}></View>
                            <Text style={{ fontSize: PxFit(15) }}>提现金额</Text>
                        </Row>
                    </View>
                    <View style={styles.withdraws}>
                        <View style={styles.center}>
                            {luckyMoney.map((luckyMoney, index) => {
                                const bool = this.calcExchange(user, luckyMoney.value);
                                return (
                                    <View key={index}>
                                        <TouchFeedback
                                            style={[
                                                styles.withdrawItem,
                                                bool && {
                                                    backgroundColor: '#FFF2EB',
                                                },
                                            ]}
                                            onPress={() => {
                                                this.handleWithdraws(luckyMoney.value);
                                            }}>
                                            <Text
                                                style={[
                                                    styles.content,
                                                    bool && {
                                                        color: Theme.themeRed,
                                                    },
                                                ]}>
                                                {luckyMoney.value}元
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    color: luckyMoney.value === 1 ? '#FFA200' : Theme.subTextColor,
                                                }}>
                                                {luckyMoney.value === 1
                                                    ? '新人无门槛'
                                                    : `${luckyMoney.value * 36}日贡献`}
                                            </Text>
                                        </TouchFeedback>

                                        <View
                                            style={[
                                                styles.badge,
                                                {
                                                    backgroundColor:
                                                        luckyMoney.value === 1 ? Theme.themeRed : Theme.primaryColor,
                                                },
                                            ]}>
                                            <Text style={styles.badgeText}>
                                                {luckyMoney.value === 1 ? '秒到账' : '限量抢'}
                                            </Text>
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
                                        总提现{user.wallet.total_withdraw_amount || 0}/ 今日贡献
                                        {user.today_contributes}{' '}
                                    </Text>
                                    <Image
                                        source={require('../../../assets/images/question.png')}
                                        style={{ width: 11, height: 11 }}
                                    />
                                </TouchFeedback>
                                {/*<Button
                                    title={'提现记录'}
                                    style={{
                                        height: PxFit(38),
                                        borderRadius: PxFit(19),
                                        backgroundColor: Theme.primaryColor,
                                        width: WPercent(80),
                                    }}
                                    onPress={() => navigation.navigate('BillingRecord')}
                                />*/}
                                <Button
                                    title={'立即提现'}
                                    style={styles.button}
                                    onPress={() => this.createWithdraw(1)}
                                />
                            </View>
                        ) : (
                            <WithdrawGuidance navigation={navigation} user={user} />
                        )}
                    </View>
                    <SubmitLoading isVisible={isVisible} content={'加载中...'} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    tipsContent: {
        fontSize: PxFit(13),
        color: Theme.theme,
        textDecorationLine: 'underline',
        textAlign: 'center',
        marginBottom: 15,
    },
    accumulat: {
        flexDirection: 'row',
        marginVertical: PxFit(Theme.itemSpace),
    },
    accumulated: {
        flex: 1,
        justifyContent: 'center',
    },
    type: {
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
    boldBlackText: {
        textAlign: 'center',
        color: Theme.secondaryColor,
        fontSize: PxFit(30),
        fontWeight: '500',
        lineHeight: PxFit(32),
        marginBottom: PxFit(5),
        marginTop: PxFit(15),
    },
    center: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingBottom: 100,
    },
    content: {
        color: Theme.black,
        fontSize: PxFit(15),
    },
    currentGold: {},
    footer: {
        alignItems: 'center',
        paddingTop: PxFit(30),
    },
    greyText1: {
        textAlign: 'center',
        color: Theme.subTextColor,
        fontSize: PxFit(14),
    },
    greyText2: {
        textAlign: 'center',
        color: Theme.subTextColor,
        fontSize: PxFit(13),
    },
    line: {
        alignSelf: 'stretch',
        backgroundColor: '#f0f0f0',
        width: PxFit(1),
    },
    slenderBlackText: {
        textAlign: 'center',
        color: Theme.defaultTextColor,
        fontSize: PxFit(17),
        fontWeight: '300',
        lineHeight: PxFit(18),
        marginTop: PxFit(10),
    },
    titleBadge: {
        height: 16,
        width: 3,
        backgroundColor: Theme.primaryColor,
        marginRight: PxFit(10),
    },
    statistics: {
        marginBottom: PxFit(Theme.itemSpace),
        marginTop: PxFit(Theme.itemSpace),
    },
    tips: {
        color: Theme.grey,
        fontSize: PxFit(12),
        lineHeight: PxFit(18),
        paddingVertical: PxFit(10),
        textAlign: 'center',
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

    withdraws: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: PxFit(15),
    },
    button: {
        height: PxFit(38),
        borderRadius: PxFit(19),
        backgroundColor: Theme.primaryColor,
        width: WPercent(80),
    },
});

export default compose(
    graphql(GQL.CreateWithdrawMutation, { name: 'CreateWithdrawMutation' }),
    graphql(GQL.UserMeansQuery, {
        options: () => ({ variables: { id: app.me.id } }),
    }),
)(WithdrawBody);
