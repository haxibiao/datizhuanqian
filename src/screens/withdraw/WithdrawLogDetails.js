/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:48:46
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Avatar, PageContainer, StatusView } from 'components';

import { Query, GQL } from 'apollo';
import { app } from 'store';

class WithdrawLogDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { navigation } = this.props;
        const { withdraw_id } = navigation.state.params;

        return (
            <PageContainer title="提现详情" white>
                <Query
                    query={GQL.WithdrawQuery}
                    variables={{
                        id: withdraw_id,
                    }}>
                    {({ data, error, loading, refetch }) => {
                        if (error) return <StatusView.ErrorView onPress={refetch} />;
                        if (loading) return <StatusView.LoadingSpinner />;
                        if (!(data && data.withdraw)) return <StatusView.EmptyView />;
                        let withdraw = data.withdraw;
                        let withdrawType = '支付宝';
                        switch (withdraw.to_platform) {
                            case 'wechat':
                                withdrawType = '微信';
                                break;
                            case 'dongdezhuan':
                                withdrawType = '懂得赚';
                                break;
                            case 'damei':
                                withdrawType = '答妹';
                                break;
                            default:
                                break;
                        }
                        return (
                            <View
                                style={{
                                    backgroundColor: Theme.white,
                                }}>
                                <View
                                    style={{
                                        paddingHorizontal: PxFit(15),
                                    }}>
                                    <View style={styles.header}>
                                        <Avatar
                                            size={38}
                                            source={{
                                                uri: app.me.avatar,
                                            }}
                                        />
                                        <Text style={styles.name}> {app.me.name} </Text>
                                    </View>
                                    <View style={styles.info}>
                                        <Text style={styles.money}>{withdraw.amount}</Text>
                                        {withdraw.status == -1 ? (
                                            <Text
                                                style={{
                                                    fontSize: PxFit(16),
                                                    color: Theme.errorColor,
                                                }}>
                                                交易失败
                                            </Text>
                                        ) : (
                                            <Text
                                                style={{
                                                    fontSize: PxFit(16),
                                                    color: Theme.weixin,
                                                }}>
                                                交易成功
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.textLeft}>提现平台 </Text>
                                        <Text style={styles.textRight}>{withdrawType}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.textLeft}>提现单号 </Text>
                                        <Text style={styles.textRight}>{withdraw.biz_no} </Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.textLeft}>转账备注 </Text>
                                        <Text style={styles.textRight}>智慧点提现 </Text>
                                    </View>
                                    {withdraw.to_platform == 'alipay' && app.me.wallet.real_name && (
                                        <View
                                            style={[
                                                styles.row,
                                                {
                                                    paddingBottom: PxFit(15),
                                                },
                                            ]}>
                                            <Text style={styles.textLeft}>收款账户 </Text>
                                            <Text style={styles.textRight}>{app.me.wallet.real_name}</Text>
                                        </View>
                                    )}

                                    <View style={styles.borderRow}>
                                        <Text style={styles.textLeft}>
                                            {withdraw.status == -1 ? '提现时间' : '到账时间'}
                                        </Text>
                                        <Text style={styles.textRight}>
                                            {withdraw.status == -1 ? withdraw.created_at : withdraw.updated_at}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.row,
                                            {
                                                paddingBottom: PxFit(15),
                                            },
                                        ]}>
                                        <Text style={styles.textLeft}>订单号 </Text>
                                        <Text style={styles.text}> {withdraw.trade_no} </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        paddingHorizontal: PxFit(15),
                                        borderTopWidth: PxFit(10),
                                        borderTopColor: Theme.lightBorder,
                                    }}>
                                    <View style={styles.footer}>
                                        <Text
                                            style={[
                                                styles.textLeft,
                                                {
                                                    lineHeight: PxFit(22),
                                                },
                                            ]}>
                                            回执信息 {'   '} <Text style={[styles.textRight]}> {withdraw.remark} </Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                </Query>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: PxFit(15),
    },

    name: {
        paddingLeft: PxFit(10),
        fontSize: PxFit(18),
        color: Theme.defaultTextColor,
    },
    info: {
        alignItems: 'center',
        marginVertical: PxFit(20),
    },
    money: {
        fontSize: PxFit(36),
        paddingBottom: PxFit(15),
        color: Theme.defaultTextColor,
    },
    row: {
        paddingBottom: PxFit(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textLeft: {
        fontSize: PxFit(15),
        color: Theme.subTextColor,
    },
    textRight: {
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        textAlign: 'right',
    },
    text: {
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        width: (Device.WIDTH * 5) / 9,
        textAlign: 'right',
    },
    borderRow: {
        paddingBottom: PxFit(20),
        paddingTop: PxFit(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: PxFit(0.5),
        borderTopColor: Theme.borderColor,
    },
    footer: {
        paddingVertical: PxFit(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default WithdrawLogDetails;
