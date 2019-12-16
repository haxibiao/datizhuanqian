import { NativeModules, Platform } from 'react-native';
import { TTAppID, TTAppIDIOS, CodeIdFeed, CodeIdFeedIOS } from '@app/app.json';

const adArgs = {
    appid: Platform.OS === 'ios' ? TTAppIDIOS : TTAppID,
    codeid: Platform.OS === 'ios' ? CodeIdFeedIOS : CodeIdFeed,
};

export const init = () => {
    return NativeModules.AdManager.init(adArgs);
};

export const loadFeedAd = () => {
    return NativeModules.AdManager.loadFeedAd(adArgs);
};

export default { init, loadFeedAd };
