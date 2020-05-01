import React, { Component, useCallback, useContext, useState, useRef, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { PageContainer, Iconfont, Row, PopOverlay, SafeText } from '@src/components';
import { observer, app } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';
import { GQL, useMutation, useQuery } from '@src/apollo';

const WithdrawalOptions = [10, 30, 50, 100];
const BANNER_WIDTH = Device.WIDTH - PxFit(Theme.itemSpace * 2);

export default observer(props => {
    let user = app.me;
    const navigation = useNavigation();
    const amount = useRef(0);
    const walletAdapterData = useRef({
        id: null,
        pay_account: '',
        real_name: '',
        total_withdraw_amount: 0,
        today_withdraw_left: 0,
        balance: 0,
        available_balance: 0,
    }).current;
    const { data: userData } = useQuery(GQL.UserMeansQuery, {
        fetchPolicy: 'network-only',
    });

    const me = Helper.syncGetter('user', userData) || {};
    user = Object.assign({}, user, { ...me });
    const myWallet =
        useMemo(() => Helper.syncGetter('user.wallet', userData), [userData]) || user.wallet || walletAdapterData;

    const [withdrawRequest, { error, data: withdrawData }] = useMutation(GQL.CreateWithdrawMutation, {
        variables: {
            amount: amount.current,
        },
        client: app.mutationClient,
        errorPolicy: 'all',
        refetchQueries: (): any[] => [
            {
                query: GQL.WithdrawsQuery,
            },
            {
                query: GQL.UserMeansQuery,
                variables: { id: user.id },
            },
        ],
    });

    const setWithdrawAmount = useCallback(
        value => {
            if (myWallet.id) {
                if (myWallet.balance < value) {
                    Toast.show({ content: `您的提现余额不足` });
                } else {
                    amount.current = value;
                    withdrawRequest();
                }
            } else {
                Toast.show({ content: `请先绑定支付宝账号` });
            }
        },
        [myWallet],
    );

    useEffect(() => {
        if (error) {
            Toast.show({ content: error.message || '提现失败' });
        } else if (withdrawData) {
            navigation.navigate('WithdrawApply', {
                amount: amount.current,
                created_at: Helper.syncGetter('data.createWithdraw.created_at', withdrawData),
            });
        }
    }, [withdrawData, error]);

    return (
        <PageContainer title="提现">
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.withdrawTop}>
                    <Text style={styles.withdrawTitle}>提现金额</Text>
                    {!myWallet.pay_account && (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('ModifyAliPay');
                            }}>
                            <Row>
                                <Image
                                    source={require('@src/assets/images/broad_tips.png')}
                                    style={styles.broadTipsImage}
                                />
                                <Text style={styles.bindAiLiPay}>请先绑定支付宝</Text>
                            </Row>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.withdrawOptionsWrap}>
                    <View style={styles.withdrawOptions}>
                        {WithdrawalOptions.map((value, index) => {
                            const selected = value === amount;
                            return (
                                <TouchableOpacity
                                    style={[styles.valueItem, selected && styles.selectedItem]}
                                    key={index}
                                    onPress={() => setWithdrawAmount(value)}>
                                    <SafeText style={[styles.moneyText, selected && { color: '#fff' }]}>
                                        {value}元
                                    </SafeText>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <View style={styles.rule}>
                    <Text style={[styles.ruleText, styles.ruleTitle]}>提现说明</Text>
                    <Text style={styles.ruleText}>
                        {`1. 您可以通过首页刷视频等方式获取${Config.goldAlias}；只有当您绑定支付宝之后，才能开始提现。`}
                    </Text>
                    <Text style={styles.ruleText}>
                        {`2. 每天凌晨 00:00-08:00 期间，系统会把您账户中的所有${Config.goldAlias}自动转为余额。`}
                    </Text>
                    <Text style={styles.ruleText}>3. 提现 3~5 天内到账。若遇高峰期，可能延迟到账，请您耐心等待。</Text>
                    <Text style={styles.ruleText}>
                        {`4.每天的转换汇率与平台收益及您的平台活跃度相关，因此汇率会受到影响上下浮动；活跃度越高，汇率越高；您可以通过刷视频、点赞评论互动、邀请好友一起来${
                            Config.AppName
                        }等行为来提高活跃度。`}
                    </Text>
                    <Text style={styles.ruleText}>
                        5.
                        提现金额分为1元、3元、5元、10元四档，每次提现将扣除相应余额，剩余余额可以在下次满足最低提现额度时申请提现。
                    </Text>
                    <Text style={styles.ruleText}>
                        {`6.若您通过非正常手段获取${
                            Config.goldAlias
                        }或余额（包括但不限于刷单、应用多开等操作、一人名下只能绑定一个支付宝，同一人不得使用多个账号提现），${
                            Config.AppName
                        }有权取消您的提现资格，并视情况严重程度，采取封禁等措施。`}
                    </Text>
                </View>
            </ScrollView>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    bindAiLiPay: {
        color: Theme.link,
        fontSize: PxFit(14),
        textDecorationLine: 'underline',
    },
    blackText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        marginLeft: PxFit(6),
    },
    boldBlackText1: {
        color: Theme.defaultTextColor,
        // fontFamily: ' ',
        fontSize: PxFit(14),
        fontWeight: 'bold',
    },
    boldBlackText2: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    boldBlackText3: {
        color: Theme.defaultTextColor,
        // fontFamily: ' ',
        fontSize: PxFit(30),
        fontWeight: 'bold',
    },
    broadTipsImage: {
        height: PxFit(16),
        marginRight: PxFit(5),
        width: PxFit(16),
    },
    container: {
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingBottom: PxFit(48) + PxFit(Theme.itemSpace * 2) + Device.HOME_INDICATOR_HEIGHT,
    },
    moneyText: {
        color: Theme.subTextColor,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    rule: {
        backgroundColor: '#fff',
        borderRadius: PxFit(15),
        margin: PxFit(Theme.itemSpace),
    },
    ruleText: {
        color: Theme.subTextColor,
        fontSize: PxFit(14),
        lineHeight: PxFit(18),
        paddingVertical: PxFit(5),
    },
    ruleTitle: {
        color: Theme.defaultTextColor,
        fontWeight: 'bold',
    },
    selectedItem: {
        backgroundColor: Theme.secondaryColor,
    },
    statistics: {
        margin: PxFit(Theme.itemSpace),
    },
    valueItem: {
        alignItems: 'center',
        backgroundColor: Theme.groundColour,
        borderRadius: PxFit(4),
        height: PxFit(50),
        justifyContent: 'center',
        marginRight: PxFit(Theme.itemSpace),
        marginTop: PxFit(Theme.itemSpace),
        width: (Device.WIDTH - PxFit(Theme.itemSpace * 3)) / 2,
    },
    whiteText: {
        color: '#fff',
        fontSize: PxFit(16),
    },
    withdrawBtn: {
        alignItems: 'center',
        borderRadius: PxFit(22),
        height: PxFit(44),
        justifyContent: 'center',
    },
    withdrawLogBtn: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: PxFit(14),
        height: PxFit(28),
        justifyContent: 'center',
        paddingHorizontal: PxFit(14),
    },
    withdrawLogBtnText: {
        color: '#fff',
        fontSize: PxFit(14),
        fontWeight: 'bold',
    },
    withdrawOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    withdrawOptionsWrap: {
        marginBottom: PxFit(Theme.itemSpace),
        marginLeft: PxFit(Theme.itemSpace),
    },
    withdrawText: {
        color: Theme.primaryColor,
        fontSize: PxFit(17),
    },
    withdrawTitle: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    withdrawTop: {
        margin: PxFit(Theme.itemSpace),
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
