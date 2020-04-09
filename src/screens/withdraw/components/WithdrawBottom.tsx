import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchFeedback, Button, Row } from 'components';
import { useQuery, GQL } from 'apollo';
import { app } from 'store';
import { SCREEN_WIDTH, WPercent } from 'utils';

const WithdrawBottom = props => {
    const { selectWithdrawCount, navigation } = props;

    const { data, loading, error } = useQuery(GQL.withdrawInfoQuery, {
        variables: { id: app.me.id },
    });

    let withdraw = Helper.syncGetter('user', data);

    useEffect(() => {
        // 更新缓存
        if (withdraw) {
            app.updateWithdrawCache(withdraw);
        }
    }, [data, loading]);

    if (!withdraw) {
        if (app && app.withdrawCache) {
            withdraw = app.withdrawCache;
        } else {
            withdraw = { withdrawInfo: withdrawData };
        }
    }

    return (
        <View style={styles.withdraws}>
            <Row style={{ justifyContent: 'space-between', marginTop: PxFit(15), paddingHorizontal: PxFit(15) }}>
                <Row>
                    <View style={styles.titleBadge} />
                    <Text style={{ fontSize: PxFit(15) }}>提现金额</Text>
                </Row>
                <Text style={styles.tips}>
                    总提现:{Helper.syncGetter('wallet.total_withdraw_amount', withdraw) || 0}（元）
                </Text>
            </Row>
            <View style={styles.center}>
                {withdraw.withdrawInfo.map((data, index) => {
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
                <Button title={'提现日志'} style={styles.button} onPress={() => navigation.navigate('BillingRecord')} />
            </View>
        </View>
    );
};

const withdrawData = [
    {
        tips: '秒到账',
        amount: 0.5,
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

const styles = StyleSheet.create({
    withdraws: {
        flex: 1,
        justifyContent: 'space-between',
    },
    titleBadge: {
        height: 16,
        width: 3,
        backgroundColor: Theme.primaryColor,
        marginRight: PxFit(10),
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
        marginTop: PxFit(15),
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

export default WithdrawBottom;
