/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 14:41:10
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from '../../../components';
import { Config, Theme, PxFit, SCREEN_WIDTH } from '../../../utils';
import { Overlay } from 'teaset';

class RuleDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View
                style={{
                    width: SCREEN_WIDTH - PxFit(70),
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
                        2.提现金额分为1元、3元、5元、10元四档，每次提现时会扣除智慧点，剩余智慧点可以在下次满足最低提现额度时申请提现。
                    </Text>
                    <Text style={styles.text}>
                        3.懂得赚是答题赚钱、答妹等时下热门赚钱APP的官方专属钱包，汇聚百款赚钱APP收益一键提现，不限时秒提现，是千万网赚用户必备的赚钱提现法宝。
                    </Text>
                    <Text style={styles.text}>
                        4.一个账号只能绑定一个支付宝或微信进行提现，使用多个账号绑定同一支付宝或微信，提现系统将判定涉嫌恶意刷取智慧点，
                        {Config.AppName}官方将做限制提现处理,同时清空所有智慧点。
                    </Text>
                    <Text style={styles.text}>
                        5.每日只能进行一次提现,提现24小时内到账(如遇提现高峰，提现到账时间会延长)。
                    </Text>
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
