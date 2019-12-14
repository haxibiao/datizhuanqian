/*
 * @Author: Gaoxuan
 * @Date:   2019-07-18 11:20:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, Button } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from 'utils';

class ShareRule extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.container}>
                <Text
                    style={{ color: Theme.theme, fontSize: PxFit(20), textAlign: 'center', marginVertical: PxFit(5) }}>
                    活动规则
                </Text>

                <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: PxFit(5) }}>
                    <View style={styles.item}>
                        <View style={styles.badge}>
                            <Text style={{ color: Theme.white }}>1</Text>
                        </View>
                        <Text style={styles.text}>
                            每成功邀请一位新用户下载登录APP（并绑定手机号），您将获得600智慧点和36贡献点的奖励，您可以将活动页面通过微信、QQ、微博等方式分享给好友，同时您邀请的好友登录后也将获得新人福利智慧点奖励，邀请好友人数无上限，邀请越多奖励越多。
                        </Text>
                    </View>
                    <View style={styles.item}>
                        <View style={styles.badge}>
                            <Text style={{ color: Theme.white }}>2</Text>
                        </View>
                        <Text style={styles.text}>
                            您邀请的好友必须是{Config.AppName}
                            新用户才能邀请成功，即手机号/支付宝/QQ邮箱均未注册登录使用过{Config.AppName}
                            APP，同一个手机号、同一个设备或同一个提现账号都视为一个用户，每个新用户只能被邀请一次，已经被他人邀请过的好友不能重复邀请。
                        </Text>
                    </View>
                    <View style={styles.item}>
                        <View style={styles.badge}>
                            <Text style={{ color: Theme.white }}>3</Text>
                        </View>
                        <Text style={styles.text}>
                            为了保证广大答友的收益不被影响，对于非正常邀请行为的用户（如刷机等违规手段），
                            {Config.AppName}官方有权取消其参与分享活动的资格，并扣除奖励不予结算。
                        </Text>
                    </View>
                </ScrollView>
                <Button title={'知道了'} onPress={() => this.props.hide()} style={styles.buttonText} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH - PxFit(70),
        height: ((SCREEN_WIDTH - PxFit(110)) * 1000) / 618,
        paddingHorizontal: PxFit(25),
        paddingVertical: PxFit(20),
        borderRadius: PxFit(15),
        backgroundColor: '#fff',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    badge: {
        height: 18,
        width: 18,
        borderRadius: 9,
        backgroundColor: Theme.theme,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    text: {
        width: SCREEN_WIDTH - PxFit(146),
        marginLeft: 8,
        paddingVertical: PxFit(2),
        lineHeight: PxFit(18),
        fontSize: PxFit(13),
        color: Theme.subTextColor,
    },
    buttonText: {
        height: PxFit(38),
        borderRadius: PxFit(19),
        marginTop: PxFit(10),
        backgroundColor: Theme.primaryColor,
    },
});

export default ShareRule;
