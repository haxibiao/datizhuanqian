/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:21:28
 */

import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { storage, keys } from 'store';
import { AppUpdateOverlay } from 'components';
import { Config } from 'utils';

function manualUpdate(versionData: { version: any }) {
    const localVersion = Config.Version || '1.0.0'; // 本地版本
    const onlineVersion = versionData.version || '1.0.0'; // 线上版本
    const showUpdateTips = compareVersion({ onlineVersion, localVersion });

    if (showUpdateTips) {
        AppUpdateOverlay.show({ versionData, onlineVersion });
    } else {
        Toast.show({ content: '已经是最新版本了' });
    }
}

async function autoUpdate(versionData: { version: any; is_force: any }) {
    const viewedVersion = (await storage.getItem(keys.viewedVersion)) || '1.0.0';
    // viewedVersion 观测当前版本用户是否已查看过更新日志

    const localVersion = Config.Version || '1.0.0'; // 本地版本
    const onlineVersion = versionData.version || '1.0.0'; // 线上版本

    const showUpdateTips = compareVersion({ onlineVersion, localVersion });
    const onlyOnceTips = compareVersion({ onlineVersion, localVersion: viewedVersion });
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
    fetch(Config.ApiServceRoot + '/api/app-version' + '?package=' + Config.PackageName, {
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

interface Props {
    onlineVersion: any; //线上版本
    localVersion: any; //本地版本
}

const compareVersion = (props: Props) => {
    //TODO 后期服务端需要扩充 versionCode
    const { onlineVersion, localVersion } = props;

    let result = false;

    let onlineVersionList = onlineVersion.split('.');
    let localVersionList = localVersion.split('.');
    // console.log('versionList', localVersionList);
    if (onlineVersionList.length < 3) {
        onlineVersionList.push('0');
    }

    if (localVersionList.length < 3) {
        localVersionList.push('0');
    }

    // console.log('versionList', onlineVersionList, localVersionList);
    for (let i = 0; i < onlineVersionList.length; i++) {
        if (onlineVersionList[i] > localVersionList[i]) {
            result = true;
            return result;
        }

        if (onlineVersionList[i] < localVersionList[i]) {
            result = false;
            return result;
        }
    }
    return result;
};
