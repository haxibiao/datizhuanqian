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

interface reward {
    gold?: number;
    ticket?: number;
    contribute?: number;
}

export const loadRewardDialog = (options?: adinfo, userReward?: reward) => {
    console.log('userReward', userReward);
    if (options && !options.tt_appid) {
        return;
    }
    return module.loadAd(options, userReward);
};

export default { loadRewardDialog };
