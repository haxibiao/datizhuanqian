import { Platform } from 'react-native';
import { Config } from 'utils';

// 获取广告开启配置
export default function(callback: Promise) {
    const deviceHeaders = {};

    deviceHeaders.os = Platform.OS; // 操作系统
    deviceHeaders.build = Config.Build; // 手动修改的build版本号
    deviceHeaders.referrer = Config.AppStore; // 应用商店来源
    deviceHeaders.version = Config.Version; // 手动修改的App版本号
    deviceHeaders.appid = Config.PackageName; // 手动修改的包名
    deviceHeaders.package = Config.PackageName; // 手动修改的包名

    fetch(Config.ServerRoot + '/api/app-ad-manage?' + Date.now(), {
        method: 'POST',
        headers: {
            ...deviceHeaders,
        },
    })
        .then(response => response.json())
        .then(result => {
            console.log('result', result);
            callback(result);
        })
        .catch(error => {
            console.log('error', error);
            callback({
                enable_splash: false,
                enable_question: true,
                enable_reward: true,
                enable_banner: true,
                enable_feed: true,
                disable: {
                    huawei: false,
                    ios: true,
                },
            });
        });
}
