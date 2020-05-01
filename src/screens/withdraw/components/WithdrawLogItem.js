/*
 * @flow
 * created by wyk made in 2019-04-11 17:14:30
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Row } from 'components';

function WithdrawLogItem(props) {
    const { style, navigation, item } = props;
    let statusText,
        color,
        image_url,
        withdrawTips,
        size = 40;
    switch (item.status) {
        case -1:
            statusText = '提现失败';
            color = Theme.errorColor;
            break;
        case 1:
            statusText = '提现成功';
            color = Theme.weixin;
            break;
        case 0:
            statusText = '待处理';
            color = Theme.correctColor;
            break;
    }

    switch (item.to_platform) {
        case 'alipay':
            image_url = require('../../../assets/images/zhifubao.png');
            break;
        case 'wechat':
            image_url = require('../../../assets/images/wechat.png');
            break;
        case 'dongdezhuan':
            image_url = require('../../../assets/images/ic_dongdezhuan.png');
            withdrawTips = '(提现到懂得赚)';
            break;
        case 'damei':
            image_url = require('../../../assets/images/ic_damei.png');
            withdrawTips = '(提现到答妹)';
            break;
        default:
            image_url = require('../../../assets/images/money_icon.png');
            size = 46;
            break;
    }

    return (
        <TouchableOpacity
            style={[styles.item, style]}
            activeOpacity={0.7}
            disabled={item.status == 0}
            onPress={() =>
                navigation.navigate('withdrawLogDetails', {
                    withdraw_id: item.id,
                })
            }>
            <Image source={image_url} style={{ width: size, height: size, marginVertical: PxFit(15) }} />
            <Row style={styles.content}>
                <View style={{ width: (Device.WIDTH * 4) / 7 }}>
                    <Text style={styles.statusText}>
                        {`${statusText}`} {withdrawTips}
                    </Text>
                    {item.remark && (
                        <Text style={{ fontSize: 12, color: Theme.themeRed }} numberOfLines={1}>{`${
                            item.remark
                        }`}</Text>
                    )}
                    <Text style={styles.time}>{item.created_at}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: PxFit(20), color }}>￥{item.amount}</Text>
                </View>
            </Row>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    image: {
        width: 40,
        height: 40,
        marginVertical: PxFit(15),
    },
    content: {
        borderBottomColor: Theme.lightBorder,
        borderBottomWidth: 0.5,
        paddingVertical: 15,
        alignItems: 'flex-start',
    },
    statusText: {
        fontSize: PxFit(16),
        color: Theme.defaultTextColor,
        lineHeight: PxFit(22),
    },
    time: {
        fontSize: PxFit(12),
        color: Theme.subTextColor,
        lineHeight: PxFit(22),
    },
});

export default WithdrawLogItem;
