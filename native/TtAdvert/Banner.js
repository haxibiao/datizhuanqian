import { NativeModules, Platform, DeviceEventEmitter, NativeEventEmitter } from 'react-native';

export type RewardEvent = 'CloseAd' | 'BuyAd';

let module = NativeModules.Banner;
let eventPrefix = 'BannerAd-';
let deviceEmitter = Platform.OS == 'android' ? DeviceEventEmitter : null;

let adArgs = {
	tt_appid: '5016518', //正式
	tt_codeid: '916518401'
	// tt_appid: '5016582', //内测
	// tt_codeid: '916582270'
};

export const loadBannerAd = options => {
	if (options && !options.tt_appid) {
		return;
	}
	return module.loadAd(options);
};

export const addListener = (eventType: RewardEvent, listener: Function) => {
	return deviceEmitter.addListener(eventPrefix + eventType, data => {
		listener();
	});
};

export default { loadBannerAd, addListener };
