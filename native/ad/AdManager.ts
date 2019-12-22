import { NativeModules, Platform } from 'react-native';
import { BDAppId, TXAppId, TTAppId, TTAppIdIOS, CodeIdFeed, CodeIdFeedIOS } from '@app/app.json';

const adArgs = {
    appid: Platform.OS === 'ios' ? TTAppIdIOS : TTAppId,
};

export const init = () => {
    NativeModules.AdManager.init(adArgs);
    // 百度广告sdk
    NativeModules.AdManager.initBd({ appid: BDAppId });
    // 腾讯广告sdk
    NativeModules.AdManager.initTx({ appid: TXAppId });
};

export const loadFeedAd = () => {
    return NativeModules.AdManager.loadFeedAd({ codeid: Platform.OS === 'ios' ? CodeIdFeedIOS : CodeIdFeed });
};

export default { init, loadFeedAd };
