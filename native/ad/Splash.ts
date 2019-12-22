import { NativeModules, Platform } from 'react-native';
import { CodeIdSplash, CodeIdSplashIOS } from '@app/app.json';
import service from 'service';

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
    service.dataReport({
        data: { category: '广告点击', action: 'user_show_splash_ad', name: '开屏广告展示' },
        callback: result => {
            console.warn('result', result);
        },
    });
    return module.loadSplashAd(adArgs);
};

export default { loadSplashAd };
