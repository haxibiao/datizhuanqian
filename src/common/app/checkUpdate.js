/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:21:28
 */

import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { storage, keys } from '../../store/storage';
import AppUpdateOverlay from '../../components/Overlay/AppUpdateOverlay';
import { Config } from 'utils';
import { contrastVersion } from '../helper';

function manualUpdate(versionData: { version: any }) {
    const localVersion = Config.Version || '1.0.0'; // 本地版本
    const onlineVersion = versionData.version || '1.0.0'; // 线上版本
    const showUpdateTips = contrastVersion({ onlineVersion, localVersion });

    if (showUpdateTips) {
        AppUpdateOverlay.show({ versionData, onlineVersion });
    } else {
        Toast.show({ content: '已经是最新版本了' });
    }
}

async function autoUpdate(versionData: { version: any, is_force: any }) {
    const viewedVersion = (await storage.getItem(keys.viewedVersion)) || '1.0.0';
    console.log('viewedVersion', Config.Version);
    // viewedVersion 观测当前版本用户是否已查看过更新日志

    const localVersion = Config.Version || '1.0.0'; // 本地版本
    const onlineVersion = versionData.version || '1.0.0'; // 线上版本

    const showUpdateTips = contrastVersion({ onlineVersion, localVersion });
    const onlyOnceTips = contrastVersion({ onlineVersion, localVersion: viewedVersion });
    if (showUpdateTips && versionData.is_force) {
        AppUpdateOverlay.show({ versionData, onlineVersion });
        //  强制更新
    } else if (showUpdateTips && !versionData.is_force && onlyOnceTips) {
        AppUpdateOverlay.show({ versionData, onlineVersion });
        //  选择更新
    } else {
        return false;
    }
}

// 获取线上apk版本信息
export function checkUpdate(type: String) {
    // 如果是ios, 跳过
    if (Platform.OS === 'ios') {
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
            if (type === 'autoCheck') {
                autoUpdate(data[0]);
            } else {
                manualUpdate(data[0]);
            }
        })
        .catch(err => {
            console.warn(err);
        });
}
