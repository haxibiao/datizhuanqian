import { NativeModules, Platform, DeviceEventEmitter } from 'react-native';

export type RewardEvent = 'CloseAd' | 'BuyAd';

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

export const loadBannerAd = (options?: adinfo, result?: boolean) => {
    if (options && !options.tt_appid) {
        return;
    }
    return module.loadAd(adArgs, false);
};

export default { loadBannerAd };
