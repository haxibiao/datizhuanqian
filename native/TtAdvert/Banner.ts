import { NativeModules, Platform } from 'react-native';

const module = NativeModules.Banner;

const adArgs = {
    tt_appid: '5016518', // 正式
    tt_codeid: '916518401',
    // tt_appid: '5016582', // 内测
    // tt_codeid: '916582270'
};

interface adinfo {
    tt_appid?: string;
    tt_codeid?: string;
}

export const loadBannerAd = (options?: adinfo, answer_count?: number, error_count?: number) => {
    if (options && !options.tt_appid) {
        return;
    }
    console.log('answer_count', answer_count, error_count);
    return module.loadAd(adArgs, answer_count, error_count);
};

export default { loadBannerAd };
