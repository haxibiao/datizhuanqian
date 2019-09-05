import { NativeModules, DeviceEventEmitter, NativeEventEmitter, Platform } from 'react-native';

export type RewardEvent = 'AdLoaded' | 'VideoCached' | 'VideoWatched' | 'ApkInstalled' | 'AdClick';

let adArgs = {
	tt_appid: '5016518', //正式
	tt_codeid: '916518198'
	// tt_appid: '5016582', //内测
	// tt_codeid: '916582815'
};

let module = NativeModules.FullScreenVideo;

export const loadFullScreenVideoAd = (options): Promise<string> => {
	if (!options.tt_appid) {
		return;
	}
	return module.loadAd(options);
};

export const startFullScreenVideoAd = options => {
	return module.startAd(options);
};

export default { loadFullScreenVideoAd, startFullScreenVideoAd };
