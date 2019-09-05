import { NativeModules, DeviceEventEmitter, NativeEventEmitter, Platform } from 'react-native';

export type RewardEvent = 'AdLoaded' | 'VideoCached' | 'VideoWatched' | 'ApkInstalled' | 'AdClick';

let adArgs = {
	// tt_appid: "5016518", //正式
	// tt_codeid: "916518846",
	// tt_appid: '5016582', //内测
	// tt_codeid: '916582412',
	rewardname: '精力',
	rewardamount: 6
};

let adArgsIOS = {
	// tt_appid: "5016582", //TODO: 内测可以兼容ios, 正式需要换
	// tt_codeid: "916582412",
	rewardname: '精力',
	rewardamount: 6
};

let module = NativeModules.RewardVideo;
let eventPrefix = 'RewardVideo-';
let deviceEmitter = Platform.OS == 'android' ? DeviceEventEmitter : null;

export const loadAd = (options): Promise<string> => {
	options = {
		...adArgs,
		...options
	};
	return module.loadAd(options);
};

export const startAd = (options): Promise<string> => {
	if (!options.tt_appid) {
		return;
	}
	options = {
		...(Platform.OS == 'android' ? adArgs : adArgsIOS),
		...options
	};
	return module.startAd(options);
};

//TODO: 这个不好判断时间是否成功给到前端，还是需要后端检查回调判断用户是否已安装APK
export const addListener = (eventType: RewardEvent, listener: Function) => {
	return deviceEmitter.addListener(eventPrefix + eventType, data => {
		listener(data);
	});
};

export default { startAd, loadAd, adArgs, addListener };
