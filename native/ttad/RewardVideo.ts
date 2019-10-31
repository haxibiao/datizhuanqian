import { NativeModules, DeviceEventEmitter, Platform } from 'react-native';
import { CodeIdRewardVideo, CodeIdRewardVideoIOS } from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdRewardVideoIOS : CodeIdRewardVideo;
const module = NativeModules.RewardVideo;

const adArgs = {
    tt_appid: '', //不需要传入了
    tt_codeid: codeid,
    rewardname: '精力',
    rewardamount: 6,
    uid: Date.now(),
};

export const loadAd = (): Promise<string> => {
    return module.loadAd(adArgs);
};

export const startAd = (): Promise<string> => {
    console.log('startad');
    return module.startAd(adArgs);
};

export default { startAd, loadAd, adArgs };
