import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchFeedback, Row } from 'components';
import { app } from 'store';

const WithdrawBottom = props => {
    const { setSelectWithdraw, withdraw, selectWithdraw } = props;

    let withdrawInfo = withdraw;

    useEffect(() => {
        // 更新缓存
        if (withdrawInfo) {
            app.updateWithdrawCache(withdrawInfo);
        }
    }, [withdrawInfo]);

    if (!withdrawInfo) {
        if (app && app.withdrawCache) {
            withdrawInfo = app.withdrawCache;
        } else {
            withdrawInfo = { withdrawInfo: withdrawData };
        }
    }
    console.log('withdrawInfo :', withdrawInfo);
    return (
        <View style={styles.withdraws}>
            <Row style={{ justifyContent: 'space-between', marginTop: PxFit(25), paddingHorizontal: PxFit(15) }}>
                <Row>
                    <View style={styles.titleBadge} />
                    <Text style={{ fontSize: Font(15), color: '#3A3A3A' }}>提现金额</Text>
                </Row>
                <Text style={styles.tips}>
                    总提现:{Helper.syncGetter('wallet.total_withdraw_amount', withdrawInfo) || 0}元
                </Text>
            </Row>
            <View style={styles.center}>
                {withdrawInfo.withdrawInfo.map((data, index) => {
                    return (
                        <View key={index}>
                            <TouchFeedback
                                disabled={data.disable}
                                style={[
                                    styles.withdrawItem,
                                    selectWithdraw.amount == data.amount && {
                                        borderColor: '#FECF3F',
                                    },
                                ]}
                                onPress={() => {
                                    setSelectWithdraw(data);
                                }}>
                                <Text style={[styles.content]}>{data.amount}元</Text>
                                <Text
                                    style={{
                                        marginTop: PxFit(2),
                                        fontSize: Font(12),
                                        color: data.fontColor,
                                    }}>
                                    {data.description}
                                </Text>
                            </TouchFeedback>

                            <View
                                style={[
                                    styles.badge,
                                    {
                                        backgroundColor: data.disable ? Theme.grey : data.bgColor,
                                    },
                                ]}>
                                <Text style={styles.badgeText}>{data.tips}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
            {selectWithdraw.rule ? (
                <View style={styles.rule}>
                    <Text style={{ color: '#999999', fontSize: Font(13), lineHeight: 18 }}>
                        {selectWithdraw.amount}元提现说明：
                    </Text>
                    <Text style={{ color: '#999999', fontSize: Font(13), lineHeight: 18 }}>{selectWithdraw.rule}</Text>
                </View>
            ) : null}
        </View>
    );
};

const withdrawData = [
    {
        tips: '秒到账',
        amount: 0.5,
        description: '30日贡献',
        fontColor: '#FFA200',
        bgColor: Theme.themeRed,
        disable: false,
        rule: '0.5元提现不限量，每天仅可提现1次，需要日贡献30。',
        needContributes: 30,
    },
    {
        tips: '限量抢',
        amount: 3,
        description: '180日贡献',
        fontColor: Theme.subTextColor,
        bgColor: '#FECF3F',
        disable: false,
        rule:
            '3元提现每天定时进行额度发放，先到先得；提现时间段10:00-18:00，每个整点开始后的0-10分钟内开抢；参与限量抢前需满足日贡献180。',
        needContributes: 180,
    },
    {
        tips: '限量抢',
        amount: 5,
        description: '300日贡献',
        fontColor: Theme.subTextColor,
        bgColor: '#FECF3F',
        disable: false,
        rule:
            '5元提现每天定时进行额度发放，先到先得；提现时间段10:00-18:00，每个整点开始后的0-10分钟内开抢；参与限量抢前需满足日贡献300；用户等级需达到5级。',
        needContributes: 300,
    },
    {
        tips: '限量抢',
        amount: 10,
        description: '600日贡献',
        fontColor: Theme.subTextColor,
        bgColor: '#FECF3F',
        disable: false,
        rule:
            '10元提现每天定时进行额度发放，先到先得；提现时间段10:00-18:00，每个整点开始后的0-10分钟内开抢；参与限量抢前需满足日贡献600；用户等级需达到9级。',
        needContributes: 600,
    },
];

const styles = StyleSheet.create({
    withdraws: {
        flex: 1,
        justifyContent: 'space-between',
    },
    titleBadge: {
        height: PxFit(15),
        width: PxFit(4),
        backgroundColor: '#FFCB03',
        marginRight: PxFit(10),
        borderRadius: PxFit(3),
    },
    content: {
        color: '#424242',
        fontSize: Font(16),
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
        width: PxFit(50),
    },
    badgeText: {
        color: '#FFF',
        fontSize: Font(11),
        fontWeight: '500',
    },
    withdrawItem: {
        alignItems: 'center',
        borderColor: '#f5f5f5',
        borderWidth: PxFit(1),
        borderRadius: PxFit(5),
        height: PxFit(65),
        justifyContent: 'center',
        marginBottom: PxFit(Theme.itemSpace),
        width: (Device.WIDTH - PxFit(Theme.itemSpace * 3)) / 2,
    },
    rule: {
        backgroundColor: '#F9F9F9',
        marginHorizontal: PxFit(Theme.itemSpace),
        borderRadius: PxFit(5),
        padding: PxFit(10),
    },
    footer: {
        alignItems: 'center',
        paddingTop: PxFit(20),
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

export default WithdrawBottom;
