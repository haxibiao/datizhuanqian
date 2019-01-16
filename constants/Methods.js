import { NavigationActions } from 'react-navigation';
import Toast from 'react-native-root-toast';
import Colors from './Colors';
import codePush from 'react-native-code-push';
import Config from './Config';
import { Storage, ItemKeys } from '../store/localStorage';
import DeviceInfo from 'react-native-device-info';

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

//获取线上apk版本信息
export const achieveUpdate = (handleModalVisible, handForceUpdateModal, propsIsUpdate, login, auto) => {
	let _this = this;
	fetch(Config.ServerRoot + '/api/app-version' + '?t=' + Date.now(), {
		method: 'POST',
		headers: {
			version: DeviceInfo.getVersion(),
			brand: DeviceInfo.getBrand()
		}
	})
		.then(response => response.json())
		.then(data => {
			console.log('data', data[0]);
			if (auto) {
				autoCheckUpdate(data[0], handleModalVisible, handForceUpdateModal, propsIsUpdate, login);
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
	let localVersion = Config.localVersion.split('');
	localVersion.splice(3, 1);
	let local = parseFloat(localVersion.join(''));

	let Version = versionInfo.version;
	let onlineVersion = Version.split('');
	onlineVersion.splice(3, 1);
	let online = parseFloat(onlineVersion.join(''));
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
const autoCheckUpdate = async (versionInfo, handleUpdateModalVisible, handForceUpdateModal, propsIsUpdate, login) => {
	let isUpdate = await Storage.getItem(ItemKeys.isUpdate);
	let localVersion = Config.localVersion.split('');
	localVersion.splice(3, 1);
	let local = parseFloat(localVersion.join(''));
	let Version = versionInfo.version;
	let onlineVersion = Version.split('');
	onlineVersion.splice(3, 1);
	let online = parseFloat(onlineVersion.join(''));

	if (local < online && versionInfo.is_force) {
		handForceUpdateModal();
		// 如果线上版本大于本地版本并且是强制更新，则弹出强制更新MODAL
	} else if (local < online && !versionInfo.is_force && !isUpdate) {
		// 线上版本大于本地版本但不需要强制更新则弹出非强制更新MODAL
		handleUpdateModalVisible();
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
		//再检查codepush
	}
};
//首先判断是否是强制更新版本,渲染不同的MODAL,如果不是 需要存储取消的动作,以便不用每次启动APP都提示更新。

export { navigationAction, operationMiddleware, numberFormat, toast, numberVersion };
