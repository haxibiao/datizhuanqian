import { NativeModules } from 'react-native';

const adArgs = {
    tt_appid: '5016518', //正式
    tt_codeid: '916518198',
    // tt_appid: '5016582', //内测
    // tt_codeid: '916582815'
};

const module = NativeModules.FullScreenVideo;

interface adinfo {
    tt_appid?: string;
    tt_codeid?: string;
}

export const loadFullScreenVideoAd = (options: adinfo): Promise<string> => {
    return module.loadAd(options);
};

export const startFullScreenVideoAd = (options: adinfo) => {
    if (!options.tt_appid) {
        return;
    }
    return module.startAd(options);
};

export default { loadFullScreenVideoAd, startFullScreenVideoAd };
