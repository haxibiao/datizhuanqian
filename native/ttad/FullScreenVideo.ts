import { NativeModules, Platform } from 'react-native';

const adArgs = {
    //默认一个app一个全屏视频的广告为， 未上架的用内测 （答赚目前ios未上架，用内测codeid: 916582815 ）
    tt_codeid: Platform.OS == 'android' ? '916518198' : '916582815',
};

const module = NativeModules.FullScreenVideo;

interface adinfo {
    tt_codeid?: string;
}

export const loadFullScreenVideoAd = (options: adinfo): Promise<string> => {
    options = {
        ...adArgs,
        // ...options, 
    };
    return module.loadAd(options);
};

export const startFullScreenVideoAd = (options: adinfo) => {
    options = {
        ...adArgs,
        // ...options,
    };
    return module.startAd(options);
};

export default { loadFullScreenVideoAd, startFullScreenVideoAd };
