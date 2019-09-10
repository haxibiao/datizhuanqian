/*
 * @Author: Gaoxuan
 * @Date:   2019-04-17 15:58:44
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { TouchFeedback, Button, SubmitLoading, TipsOverlay } from 'components';

import { Theme, PxFit, SCREEN_WIDTH, WPercent, Tools } from 'utils';

import { compose, graphql, GQL } from 'apollo';
import { app } from 'store';

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
            isExist: false,
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
        if (data.user.today_withdraw_left < amount) {
            TipsOverlay.show({
                title: '日贡献不足',
                content: (
                    <TouchFeedback
                        style={{ alignItems: 'center', paddingTop: 10, navigation }}
                        onPress={() => {
                            navigation.navigate('任务');
                            TipsOverlay.hide();
                        }}>
                        <Text style={{ fontSize: 13, color: Theme.theme, textDecorationLine: 'underline' }}>
                            去做激励任务提升贡献值！
                        </Text>
                    </TouchFeedback>
                ),
                onConfirm: () => navigation.navigate('任务'),
            });
            // navigation.navigate('WithdrawApply', { amount: 1 });
        } else {
            this.createWithdraw(amount);
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
            let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
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
        let { isVisible, luckyMoney } = this.state;
        let { userCache } = app;
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
                    <View style={styles.withdraws}>
                        <View style={styles.center}>
                            {luckyMoney.map((luckyMoney, index) => {
                                let bool = this.calcExchange(user, luckyMoney.value);
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
                                                {luckyMoney.value === 1 ? '无门槛' : `${luckyMoney.value * 36}日贡献`}
                                            </Text>
                                        </TouchFeedback>
                                        {luckyMoney.value === 1 && (
                                            <View style={styles.badge}>
                                                <Text style={styles.badgeText}>秒到账</Text>
                                            </View>
                                        )}
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
                                    title={'提现记录'}
                                    style={{
                                        height: PxFit(38),
                                        borderRadius: PxFit(19),
                                        backgroundColor: Theme.primaryColor,
                                        width: WPercent(80),
                                    }}
                                    onPress={() => navigation.navigate('BillingRecord')}
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    withdraws: {
        justifyContent: 'space-between',
        flex: 1,
    },
    center: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: PxFit(Theme.itemSpace),
        justifyContent: 'space-between',
    },
    statistics: {
        marginTop: PxFit(Theme.itemSpace),
        marginBottom: PxFit(Theme.itemSpace),
    },
    currentGold: {
        alignItems: 'center',
    },
    greyText1: {
        fontSize: PxFit(14),
        color: Theme.subTextColor,
    },
    boldBlackText: {
        marginTop: PxFit(15),
        marginBottom: PxFit(5),
        fontSize: PxFit(30),
        fontWeight: '500',
        lineHeight: PxFit(32),
        color: Theme.secondaryColor,
    },
    accumulat: {
        marginVertical: PxFit(Theme.itemSpace),
        flexDirection: 'row',
    },
    accumulated: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        alignSelf: 'stretch',
        width: PxFit(1),
        backgroundColor: '#f0f0f0',
    },
    greyText2: {
        fontSize: PxFit(13),
        color: Theme.subTextColor,
    },
    slenderBlackText: {
        marginTop: PxFit(10),
        fontSize: PxFit(17),
        lineHeight: PxFit(18),
        fontWeight: '300',
        color: Theme.defaultTextColor,
    },
    withdrawItem: {
        marginBottom: PxFit(Theme.itemSpace),
        width: (SCREEN_WIDTH - PxFit(Theme.itemSpace * 3)) / 2,
        height: PxFit(60),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: PxFit(5),
        backgroundColor: '#f5f5f5',
    },
    content: {
        fontSize: PxFit(15),
        color: Theme.black,
    },
    badge: {
        backgroundColor: Theme.primaryColor,
        position: 'absolute',
        top: 0,
        left: 0,
        width: 56,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: PxFit(10),
        borderBottomRightRadius: PxFit(10),
        borderTopLeftRadius: PxFit(5),
    },
    badgeText: {
        fontSize: 13,
        color: '#FFF',
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        paddingBottom: PxFit(30),
    },
    tips: {
        fontSize: PxFit(12),
        color: Theme.grey,
        paddingVertical: PxFit(10),
        lineHeight: PxFit(18),
        textAlign: 'center',
    },
});

export default compose(
    graphql(GQL.CreateWithdrawMutation, { name: 'CreateWithdrawMutation' }),
    graphql(GQL.UserMeansQuery, {
        options: () => ({ variables: { id: app.me.id } }),
    }),
)(WithdrawBody);
