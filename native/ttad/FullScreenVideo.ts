import { NativeModules, Platform } from 'react-native';
import { CodeIdFullVideo, CodeIdFullVideoIOS } from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdFullVideoIOS : CodeIdFullVideo;
const module = NativeModules.FullScreenVideo;

const adArgs = {
    //默认一个app一个全屏视频的广告为， 未上架的用内测 （答赚目前ios未上架，用内测codeid: 916582815 ）
    tt_codeid: codeid,
};

export const loadFullScreenVideoAd = (): Promise<string> => {
    return module.loadAd(adArgs);
};

export const startFullScreenVideoAd = () => {
    return module.startAd(adArgs);
};

export default { loadFullScreenVideoAd, startFullScreenVideoAd };
