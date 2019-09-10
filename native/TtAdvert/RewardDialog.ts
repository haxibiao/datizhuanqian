import { NativeModules, Platform, DeviceEventEmitter } from 'react-native';

const module = NativeModules.RewardDialog;

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

export const loadRewardDialog = (options?: adinfo, result?: boolean) => {
    if (options && !options.tt_appid) {
        return;
    }
    return module.loadAd(adArgs, {
        gold: 20,
        ticket: 10,
        contribute: 6,
    });
};

export default { loadRewardDialog };
