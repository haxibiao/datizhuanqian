/*
 * @Author: Gaoxuan
 * @Date:   2019-08-16 15:59:52
 * @Last Modified by:   Gaoxuan
 * @Last Modified time: 2019-08-16 15:59:52
 */
import { NativeModules, Alert } from 'react-native';
import { ISIOS } from 'utils';
// import * as WeChatIOS from 'react-native-wechat';
const WeChatIOS = {};

class WeChat {
    static shareMiniProgram(data) {
        if (ISIOS) {
            return WeChatIOS.shareToSession(data);
        }
        return NativeModules.WxEntryModule.shareMiniProgram(data);
    }

    static isSupported() {
        if (ISIOS) {
            return WeChatIOS.isWXAppSupportApi();
        }
        return NativeModules.WxEntryModule.isSupported();
    }

    static wechatLogin() {
        if (ISIOS) {
            return WXLogin();
        }
        return NativeModules.WxEntryModule.wxLogin();
    }

    static registerApp(AppID) {
        if (ISIOS) {
            return WeChatIOS.registerApp(AppID);
        }
        return NativeModules.WxEntryModule.registerApp(AppID);
    }
}

const WXLogin = () => {
    const scope = 'snsapi_userinfo';
    const state = 'wechat_sdk_demo';
    const wechat = WeChatIOS;
    // 判断微信是否安装
    wechat.isWXAppInstalled().then(isInstalled => {
        if (isInstalled) {
            // 发送授权请求
            wechat
                .sendAuthRequest(scope, state)
                .then(responseCode => {
                    // 返回code码，通过code获取access_token
                    this.getAccessToken(responseCode.code);
                })
                .catch(err => {
                    Alert.alert('登录授权发生错误：', err.message, [{ text: '确定' }]);
                });
        } else {
            ISIOS
                ? Alert.alert('没有安装微信', '是否安装微信？', [
                    { text: '取消' },
                    { text: '确定', onPress: () => this.installWechat() },
                ])
                : Alert.alert('没有安装微信', '请先安装微信客户端在进行登录', [{ text: '确定' }]);
        }
    });
};

export default WeChat;
