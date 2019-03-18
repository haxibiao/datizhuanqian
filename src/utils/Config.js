/*
 * @flow
 * created by wyk made in 2018-12-05 21:39:22
 */
import { ServerRoot, AppName, AppVersion, AppDisplayName, AppSlogan, Build } from '../../app.json';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';

let AppStore = Config && Config.APP_STORE ? Config.APP_STORE : 'haxibiao'; //应用商店名称

let AppVersionNumber = DeviceInfo.getVersion().split('');
AppVersionNumber.splice(3, 1);
AppVersionNumber = parseFloat(AppVersionNumber.join('')); //app vesrsion 数值

export default {
	ServerRoot: Config ? Config.SERVER_ROOT : ServerRoot,
	AppStore,
	AppName,
	AppDisplayName,
	AppVersion,
	AppSlogan,
	Build,
	AppVersionNumber
};
