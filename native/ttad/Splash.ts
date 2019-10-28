import { NativeModules, Platform } from 'react-native';
import { CodeIdSplash, CodeIdSplashIOS } from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdSplashIOS : CodeIdSplash;

const adArgs = {
    tt_codeid: codeid,
};

const module = NativeModules.Splash;
export const loadSplashAd = () => {
    return module.loadSplashAd(adArgs);
};

export default { loadSplashAd };
