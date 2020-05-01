import { NativeModules, Platform } from 'react-native';
import { BDAppId, TXAppId, TTAppId, TTAppIdIOS, CodeIdFeed, CodeIdFeedIOS } from '@app/app.json';

const adArgs = {
    appid: Platform.OS === 'ios' ? TTAppIdIOS : TTAppId,
};

export const init = () => {
    NativeModules.AdManager.init(adArgs);
};

export const loadFeedAd = () => {
    return NativeModules.AdManager.loadFeedAd({
        codeid: Platform.OS === 'ios' ? CodeIdFeedIOS : CodeIdFeed,
        width: Device.WIDTH - PxFit(50),
    });
};

export default { init, loadFeedAd };
