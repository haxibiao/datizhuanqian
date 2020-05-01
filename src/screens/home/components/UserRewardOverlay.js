/* eslint-disable react-native/sort-styles */
/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 14:41:10
 */

import React, { Component } from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import { TouchFeedback } from 'components';
import { GQL } from 'apollo';
import { app } from 'store';
import service from 'service';
import DeviceInfo from 'react-native-device-info';
import { Matomo } from 'native';

class UserRewardOverlay extends Component {
    constructor(props) {
        super(props);
    }

    track = name => {
        //matomo 数据上报
        Matomo.trackEvent('用户行为', name, name, 1);
    };

    handleLogin = async () => {
        const { navigation, phone, client } = this.props;
        const deviceId = DeviceInfo.getUniqueID();

        let phoneNumber = null;
        if (phone) {
            phoneNumber = phone.substr(phone.length - 11);
        }

        if (phoneNumber || deviceId) {
            // 静默注册
            app.mutationClient
                .mutate({
                    mutation: GQL.autoSignInMutation,
                    variables: {
                        account: phoneNumber,
                        uuid: deviceId,
                    },
                })
                .then(result => {
                    const canSignIn = result && result.data && result.data.autoSignIn;
                    if (canSignIn) {
                        const user = result.data.autoSignIn;
                        user.isNewUser = user.auto_uuid_user || user.auto_phone_user;
                        app.signIn(user);
                        const router = !(user.auto_uuid_user && user.auto_phone_user) ? '答题' : '提现';
                        const content = !(user.auto_uuid_user && user.auto_phone_user)
                            ? '欢迎回家，继续享受答题吧'
                            : '领取奖励成功，绑定支付宝即可提现';

                        navigation.navigate(router);
                        Toast.show({ content });
                        app.updateResetVersion(Config.Version);

                        //数据上报
                        const name =
                            user.auto_uuid_user && user.auto_phone_user
                                ? '点击领红包，老用户登录'
                                : '点击领红包，新用户静默注册';
                        this.track(name);
                    } else {
                        navigation.navigate('Login');
                        this.track('点击领红包，静默注册失败，返回值错误');
                    }
                })
                .catch(error => {
                    console.warn('err', error);
                    Toast.show({ content: error.toString() });
                    navigation.navigate('Login');
                    this.track('点击领红包，静默注册失败，未获取到UUID');
                });
        } else {
            // 手动去注册登录
            navigation.navigate('Login');
        }
    };

    render() {
        return (
            <TouchFeedback
                style={styles.container}
                onPress={() => {
                    this.props.hide();
                    this.handleLogin();
                }}>
                <Image
                    source={require('@src/assets/images/bg_new_user_red_packet.png')}
                    style={{ width: (Device.WIDTH * 3) / 5, height: (((Device.WIDTH * 3) / 5) * 615) / 471 }}
                />
            </TouchFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: Device.WIDTH - PxFit(90),
        borderRadius: PxFit(15),
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
});

export default UserRewardOverlay;
