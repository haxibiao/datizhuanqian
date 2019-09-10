/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:21:28
 */

import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { storage, keys } from '../../store/storage';
import UpdateOverlay from '../../components/Overlay/UpdateOverlay';
import Config from '../Config';

//获取线上apk版本信息
export default function(type: String) {
    //如果是ios, 跳过
    if (Platform.OS == 'ios') {
        return;
    }
    fetch(Config.ServerRoot + '/api/app-version' + '?package=' + Config.PackageName, {
        method: 'POST',
        headers: {
            version: DeviceInfo.getVersion(),
            brand: DeviceInfo.getBrand(),
        },
    })
        .then(response => response.json())
        .then(data => {
            if (type == 'autoCheck') {
                autoUpdate(data[0]);
            } else {
                manualUpdate(data[0]);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

autoUpdate = async versionData => {
    viewedVersion = (await storage.getItem(keys.viewedVersion)) || 1;
    //viewedVersion 观测当前版本用户是否已查看过更新日志

    let localVersion = Config.AppVersionNumber; //本地版本
    let serverVersion = numberVersion(versionData.version); //线上版本

    if (forceUpdate(localVersion, serverVersion, versionData)) {
        UpdateOverlay.show(versionData, serverVersion);
        // 强制更新
    } else if (selectUpdate(localVersion, serverVersion, versionData, viewedVersion)) {
        UpdateOverlay.show(versionData, serverVersion);
        // 选择更新
    } else {
        return false;
    }
};

// 线上版本大于本地版本并且是强更版本
// 或者线上版本领先本地2个版本
function forceUpdate(localVersion, serverVersion, versionData) {
    return (localVersion < serverVersion && versionData.is_force) || serverVersion > 0.1 + localVersion;
}

// 线上版本大于本地版本并且strogeVesiron版本小于线上版本
function selectUpdate(localVersion, serverVersion, versionData, viewedVersion) {
    return localVersion < serverVersion && !versionData.is_force && viewedVersion < serverVersion;
}

manualUpdate = versionData => {
    let localVersion = Config.AppVersionNumber; //本地版本
    let serverVersion = numberVersion(versionData.version); //线上版本

    if (localVersion < serverVersion) {
        UpdateOverlay.show(versionData, serverVersion);
    } else {
        Toast.show({ content: '已经是最新版本了' });
    }
};

//版本号转数值
function numberVersion(version) {
    version = version.split('');
    version.splice(3, 1);
    version = parseFloat(version.join(''));
    return version;
}
