/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 14:41:10
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from '@src/components';

class RuleDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View
                style={{
                    width: Device.WIDTH - PxFit(70),
                    paddingHorizontal: PxFit(25),
                    paddingVertical: PxFit(20),
                    borderRadius: PxFit(15),
                    backgroundColor: '#fff',
                }}>
                <Text style={{ color: Theme.defaultTextColor, fontSize: PxFit(18), textAlign: 'center' }}>
                    规则说明
                </Text>

                <View style={{ marginTop: PxFit(5) }}>
                    <Text style={styles.text}>1.只有当您绑定支付宝、微信或懂得赚账号之后，才能开始提现。</Text>
                    <Text style={styles.text}>
                        2.一个账号只能绑定一个支付宝或微信进行提现，使用多个账号绑定同一支付宝或微信，提现系统将判定涉嫌恶意刷取智慧点，
                        {Config.AppName}官方将做限制提现处理，同时清空所有智慧点。
                    </Text>
                    <Text style={styles.text}>
                        3.每天只能进行一次提现，为保证资金安全，提现时间为9:00-21:00，提现会在24小时内到账(如遇提现高峰，提现到账时间会延长)。
                    </Text>
                    <Text style={styles.text}>4.为保证资金稳定安全，对于长期未登录的用户，将适时冻结智慧点账户。</Text>
                </View>
                <Button title={'知道了'} onPress={() => this.props.hide()} style={styles.buttonText} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        paddingVertical: PxFit(2),
        lineHeight: PxFit(18),
        fontSize: PxFit(12),
        color: Theme.subTextColor,
    },
    buttonText: {
        height: PxFit(38),
        borderRadius: PxFit(19),
        marginTop: PxFit(10),
        backgroundColor: Theme.primaryColor,
    },
});

export default RuleDescription;
