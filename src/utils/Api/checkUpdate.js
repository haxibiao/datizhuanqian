/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:21:28
 */

import DeviceInfo from 'react-native-device-info';
import { Storage, ItemKeys } from '../../store/localStorage';
import { UpdateOverlay } from '../../components';
import Config from '../Config';

//获取线上apk版本信息
export default function(dispatch?: Function) {
	fetch('https://datizhuanqian.com' + '/api/app-version' + '?t=' + Date.now(), {
		method: 'POST',
		headers: {
			version: DeviceInfo.getVersion(),
			brand: DeviceInfo.getBrand()
		}
	})
		.then(response => response.json())
		.then(data => {
			handleUpdate(data[0], dispatch);
		})
		.catch(err => {
			console.log(err);
		});
}

handleUpdate = async (versionData, dispatch) => {
	let viewedVersion = 1;
	if (await Storage.getItem(ItemKeys.viewedVersion)) {
		viewedVersion = await Storage.getItem(ItemKeys.viewedVersion);
	}
	console.log('viewedVersion', await Storage.getItem(ItemKeys.viewedVersion));
	//viewedVersion 观测当前版本用户是否已查看过更新日志

	let localVersion = Config.AppVersionNumber; //本地版本
	let serverVersion = numberVersion(versionData.version); //线上版本

	if (forceUpdate(localVersion, serverVersion, versionData)) {
		UpdateOverlay.show(versionData, serverVersion);
		// 强制更新
	} else if (selectUpdate(localVersion, serverVersion, versionData, viewedVersion)) {
		UpdateOverlay.show(versionData, serverVersion, dispatch);
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

//版本号转数值
function numberVersion(version) {
	version = version.split('');
	version.splice(3, 1);
	version = parseFloat(version.join(''));
	return version;
}
