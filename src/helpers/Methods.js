import { NavigationActions } from 'react-navigation';
import { Colors, Config, Divice } from '../constants';
import { Storage, ItemKeys } from '../store/localStorage';

import DeviceInfo from 'react-native-device-info';
import codePush from 'react-native-code-push';
import Toast from 'react-native-root-toast';
import ImagePicker from 'react-native-image-crop-picker';

/*防止页面重复跳转
使用方法：navigation.dispatch(navigationAction({...}))
routeName  路由注册的routeName
params 要合并到目标路由的参数
action 在子路由器中运行的子操作
key 路由的标识符*/
function navigationAction({ routeName, params = null, action = null, key = routeName + Math.random().toString() }) {
	return NavigationActions.navigate({
		routeName,
		params,
		action,
		key
	});
}

/*需要登录验证的操作
login 是否登录
action 用户操作
navigation */
function operationMiddleware({ login, action, navigation }) {
	if (login) {
		action();
	} else {
		navigation.dispatch(navigationAction({ routeName: '登录注册' }));
	}
}

// 数字格式化
function numberFormat(number) {
	number = parseFloat(number);
	if (number >= 10000) {
		return (number / 10000).toFixed(1) + 'w';
	} else {
		return number;
	}
}

//toast
function toast(message, position, timeout = 2000) {
	let toast = Toast.show(message, {
		duration: Toast.durations.LONG,
		position: position,
		shadow: true,
		animation: true,
		hideOnPress: true,
		delay: 100,
		backgroundColor: Colors.nightColor
	});
	setTimeout(function() {
		Toast.hide(toast);
	}, timeout);
}

//版本号转数值
function numberVersion(version) {
	version = version.split('');
	version.splice(3, 1);
	version = parseFloat(version.join(''));
	return version;
}

//手机 邮箱 正则验证
function regular(account) {
	const phoneReg = /^1[3-9]\d{9}$/;
	const mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

	let value = phoneReg.test(account) || mailReg.test(account);
	return value;
}

//选择图片
function imagePicker(callback: Function) {
	ImagePicker.openPicker({
		multiple: true,
		mediaType: 'photo',
		includeBase64: true
	})
		.then(callback)
		.catch(error => {});
}

//获取线上apk版本信息
export const achieveUpdate = (
	handleModalVisible,
	handForceUpdateModal,
	changeVersionInfo,
	propsIsUpdate,
	login,
	auto
) => {
	fetch(Config.ServerRoot + '/api/app-version' + '?t=' + Date.now(), {
		method: 'POST',
		headers: {
			version: DeviceInfo.getVersion(),
			brand: DeviceInfo.getBrand()
		}
	})
		.then(response => response.json())
		.then(data => {
			if (auto) {
				autoCheckUpdate(
					data[0],
					handleModalVisible,
					handForceUpdateModal,
					propsIsUpdate,
					login,
					changeVersionInfo
				);
			} else {
				checkUpdate(data[0], handleModalVisible);
			}
		})
		.catch(err => {
			console.log(err);
		});
};

//设置页检查更新
const checkUpdate = (versionInfo, handlePromotModalVisible) => {
	let local = Config.AppVersionNumber;
	let online = numberVersion(versionInfo.version);
	//转换成浮点数  判断版本大小

	if (local < online) {
		//先判断APK是否有更新
		handlePromotModalVisible();
	} else {
		//再判断codepush是否有更新
		codePush.checkForUpdate().then(update => {
			if (!update) {
				toast('已经是最新版本了', -100);
			} else {
				codePush.sync({
					updateDialog: {
						// mandatoryContinueButtonLabel: "更新",
						// mandatoryUpdateMessage: "有新版本了，请您及时更新",
						optionalIgnoreButtonLabel: '取消',
						optionalInstallButtonLabel: '后台更新',
						optionalUpdateMessage: '发现新版本',
						title: '更新提示'
					},
					installMode: codePush.InstallMode.IMMEDIATE
				});
			}
		});
	}
};

//首页自动检查更新
//TODO:是否要检查跨版本的用户

const autoCheckUpdate = async (
	versionInfo,
	handleUpdateModalVisible,
	handForceUpdateModal,
	propsIsUpdate,
	login,
	changeVersionInfo
) => {
	let updateTipsVersion = (await Storage.getItem(ItemKeys.updateTipsVersion))
		? await Storage.getItem(ItemKeys.updateTipsVersion)
		: 1;

	let local = Config.AppVersionNumber; //本地版本
	let online = numberVersion(versionInfo.version); //线上版本

	changeVersionInfo(versionInfo.apk, online); //为提示框 link  取消更新赋值

	if (local < online && versionInfo.is_force) {
		handForceUpdateModal();
		// 如果线上版本大于本地版本并且是强制更新，则弹出强制更新MODAL
	} else if (online - local > 0.1) {
		handForceUpdateModal();
		//大版本迭代
		// 如果线上版领先本地2个版本，则强制更新
	} else if (local < online && !versionInfo.is_force && updateTipsVersion < online) {
		// 线上版本大于本地版本并且更新提示的版本小于线上版本则弹出选择更新Modal
		handleUpdateModalVisible();
	} else {
		codePush.sync({
			updateDialog: {
				optionalIgnoreButtonLabel: '取消',
				optionalInstallButtonLabel: '后台更新',
				optionalUpdateMessage: '发现新版本',
				title: '更新提示'
			},
			installMode: codePush.InstallMode.IMMEDIATE
		});
		//再检查codepush
	}
};
//首先判断是否是强制更新版本,渲染不同的MODAL,如果不是 需要存储取消的动作,以便不用每次启动APP都提示更新。

function imgsLayoutSize(imgCount, images, space = 5, maxWidth = Divice.width - 30) {
	let width,
		height,
		i = 0;
	let imgSize = [];
	switch (true) {
		case imgCount == 1:
			if (images[0].height > images[0].width) {
				height = (maxWidth * 2) / 3;
				width = (height * images[0].width) / images[0].height;
				imgSize.push({ width, height, marginTop: space });
			} else {
				if (images[0].width > maxWidth) {
					width = maxWidth;
					height = (width * images[0].height) / images[0].width;
					imgSize.push({ width, height, marginTop: space });
				} else {
					width = images[0].width;
					height = images[0].height;
					imgSize.push({ width, height, marginTop: space });
				}
			}

			break;
		case imgCount == 7:
			for (; i < imgCount; i++) {
				if (i == 0) {
					width = maxWidth;
					height = maxWidth / 2;
				} else {
					width = height = (maxWidth - space * 2) / 3;
				}
				imgSize.push({ width, height, marginLeft: space, marginTop: space });
			}
			break;
		case imgCount == 5:
		case imgCount == 8:
			for (; i < imgCount; i++) {
				if (i == 0 || i == 1) {
					width = height = (maxWidth - space) / 2;
				} else {
					width = height = (maxWidth - space * 2) / 3;
				}
				imgSize.push({ width, height, marginLeft: space, marginTop: space });
			}
			break;

		case imgCount == 2:
		case imgCount == 4:
			width = height = (maxWidth - space) / 2;
			for (; i < imgCount; i++) {
				imgSize.push({ width, height, marginRight: space, marginTop: space });
			}
			break;
		case imgCount == 3:
		case imgCount == 6:
		case imgCount == 9:
			width = height = (maxWidth - space * 2) / 3;
			for (; i < imgCount; i++) {
				imgSize.push({ width, height, marginRight: space, marginTop: space });
			}
			break;
	}
	return imgSize;
}

function imageSize({ width, height }) {
	var size = {};
	if (width > Divice.width) {
		size.width = Divice.width - 30;
		size.height = ((Divice.width - 30) * height) / width;
	} else {
		size = { width, height };
	}
	return size;
}

export {
	navigationAction,
	operationMiddleware,
	numberFormat,
	toast,
	regular,
	imagePicker,
	numberVersion,
	imgsLayoutSize,
	imageSize
};
