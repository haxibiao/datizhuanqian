/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 10:37:53
 */

import React, { Component, Fragment } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions, Slider } from 'react-native';
import { Row, TouchFeedback, Iconfont } from 'components';
import { Theme, SCREEN_WIDTH, PxFit } from 'utils';
import WithdrawHeader from './WithdrawHeader';

class NotLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            withdrawType: 'alipay',
        };
    }

    render() {
        const { navigation } = this.props;

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

        const withdrawData = [
            {
                tips: '秒到账',
                amount: 0.3,
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

        return (
            <View style={styles.container}>
                <WithdrawHeader user={{ gold: 0, today_contributes: 0, exchange_rate: 600 }} />
                <Row style={{ marginTop: PxFit(10), paddingHorizontal: PxFit(15) }}>
                    {WithdrawType.map((data, index) => {
                        return (
                            <Fragment key={index}>
                                <TouchFeedback
                                    style={[
                                        styles.withdrawType,
                                        this.state.withdrawType === data.type && { borderColor: Theme.primaryColor },
                                        index === 0 && {
                                            marginRight: PxFit(10),
                                        },
                                    ]}
                                    onPress={() => {
                                        this.setState({
                                            withdrawType: data.type,
                                        });
                                    }}>
                                    <Image source={data.icon} style={styles.withdrawTypeText} />
                                    <Text>{data.name}</Text>
                                </TouchFeedback>
                            </Fragment>
                        );
                    })}
                </Row>

                <Row
                    style={{
                        justifyContent: 'space-between',
                        marginTop: PxFit(15),
                        marginBottom: PxFit(5),
                        paddingHorizontal: PxFit(15),
                    }}>
                    <Text style={{ fontSize: PxFit(13) }}>{`绑定${
                        this.state.withdrawType === 'alipay' ? '支付宝' : '微信'
                    }后可直接提现`}</Text>
                    <TouchFeedback
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => {
                            navigation.navigate('Login');
                        }}>
                        <Text style={{ fontSize: PxFit(13), color: Theme.subTextColor }}>立即绑定</Text>
                        <Iconfont name="right" size={PxFit(13)} color={Theme.subTextColor} />
                    </TouchFeedback>
                </Row>

                <View style={styles.withdraws}>
                    <View style={styles.center}>
                        {withdrawData.map((data, index) => {
                            return (
                                <View key={index}>
                                    <TouchFeedback
                                        style={[styles.withdrawItem]}
                                        onPress={() => {
                                            navigation.navigate('Login');
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
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        justifyContent: 'space-between',
        flex: 1,
    },
    center: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: PxFit(Theme.itemSpace),
        justifyContent: 'space-between',
        paddingVertical: PxFit(10),
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
    content: {
        fontSize: PxFit(16),
        color: Theme.subTextColor,
    },
});

export default NotLogin;
