import { NativeModules, Platform } from 'react-native';
import { BDAPPID, TTAppID, TTAppIDIOS, CodeIdFeed, CodeIdFeedIOS } from '@app/app.json';

const adArgs = {
    appid: Platform.OS === 'ios' ? TTAppIDIOS : TTAppID,
};

export const init = () => {
    NativeModules.AdManager.init(adArgs);
    // 初始化百度广告sdk
    NativeModules.AdManager.initBd({ appid: BDAPPID });
};

export const loadFeedAd = () => {
    return NativeModules.AdManager.loadFeedAd({ codeid: Platform.OS === 'ios' ? CodeIdFeedIOS : CodeIdFeed });
};

export default { init, loadFeedAd };
