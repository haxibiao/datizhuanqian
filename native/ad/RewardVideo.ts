import { NativeModules, DeviceEventEmitter, Platform } from 'react-native';
import { CodeIdRewardVideo, CodeIdRewardVideoIOS } from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdRewardVideoIOS : CodeIdRewardVideo;
const module = NativeModules.RewardVideo;

// const adArgs = {
//     provider: '腾讯',
//     codeid: '9030593551196917',
// };

const adArgs = {
    codeid,
};

export const loadAd = (): Promise<string> => {
    return module.loadAd(adArgs);
};

export const startAd = (): Promise<string> => {
    return module.startAd(adArgs);
};

export default { startAd, loadAd, adArgs };
