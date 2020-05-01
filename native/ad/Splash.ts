import { NativeModules, Platform } from 'react-native';
import { CodeIdSplash, CodeIdSplashIOS } from '@app/app.json';
import { adClickTrack } from 'common';

const codeid = Platform.OS === 'ios' ? CodeIdSplashIOS : CodeIdSplash;

// const adArgs = {
//     provider: '百度',
//     codeid: '6806459',
// };
// const adArgs = {
//     provider: '腾讯',
//     codeid: '7050896561496966',
// };
const adArgs = {
    codeid,
};

const module = NativeModules.Splash;
export const loadSplashAd = () => {
    adClickTrack({
        name: '进入App,开屏广告展示',
    });
    return module.loadSplashAd(adArgs);
};

export default { loadSplashAd };
