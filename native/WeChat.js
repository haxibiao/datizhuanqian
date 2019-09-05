/*
 * @Author: Gaoxuan
 * @Date:   2019-08-16 15:59:52
 * @Last Modified by:   Gaoxuan
 * @Last Modified time: 2019-08-16 15:59:52
 */
import { NativeModules } from 'react-native';

class WeChat {
	static shareMiniProgram(data) {
		return NativeModules.WxEntryModule.shareMiniProgram(data);
	}

	static isSupported() {
		return NativeModules.WxEntryModule.isSupported();
	}

	static wechatLogin() {
		return NativeModules.WxEntryModule.wxLogin();
	}

	static registerApp(AppID) {
		return NativeModules.WxEntryModule.registerApp(AppID);
	}
}

export default WeChat;
