import { NativeModules, Platform, DeviceEventEmitter, NativeEventEmitter } from 'react-native';

let module = NativeModules.Splash;

let adArgs = {
	tt_appid: '5016518', //正式
	tt_codeid: '816518857'
	// tt_appid: '5016582', //内测
	// tt_codeid: '816582039'
};

export const loadSplashAd = () => {
	return module.loadSplashAd(adArgs);
};

export default { loadSplashAd };
