import { NativeModules, DeviceEventEmitter, Platform } from 'react-native';

const adArgs = {
    tt_appid: '5016518', //正式
    tt_codeid: '916518846',
    // tt_appid: '5016582', //内测
    // tt_codeid: '916582412',
    rewardname: '精力',
    rewardamount: 6,
    uid: 1,
};

const adArgsIOS = {
    tt_appid: '5016582', //TODO: 内测可以兼容ios, 正式需要换
    tt_codeid: '916582412',
    rewardname: '精力',
    rewardamount: 6,
};

const module = NativeModules.RewardVideo;

interface adinfo {
    tt_appid?: string;
    tt_codeid?: string;
    uid?: number;
}

export const loadAd = (options: adinfo): Promise<string> => {
    //TODO:: 暂时测试ios的集成，上架后替换
    if (Platform.OS === 'ios') {
        return module.loadAd(adArgsIOS);
    }

    options = {
        ...adArgs,
        ...options,
    };
    return module.loadAd(options);
};

export const startAd = (options: adinfo): Promise<string> => {
    console.log('startad');
    //TODO:: 暂时测试ios的集成，上架后替换
    if (Platform.OS === 'ios') {
        return module.startAd(adArgsIOS);
    }

    if (!options.tt_appid) {
        return module.startAd(adArgs);
    } else {
        options = {
            ...adArgs,
            ...options,
        };
        return module.startAd(options);
    }
};

export default { startAd, loadAd, adArgs };
