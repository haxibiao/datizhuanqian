import { ServerRoot, AppName, AppVersion, localVersion, AppDisplayName, AppSlogan, Build } from '../../app.json';
// import * as Methods from './Methods';

import Config from 'react-native-config';

let AppStore = Config ? Config.APP_STORE : null;

let AppVersionNumber = localVersion.split('');
AppVersionNumber.splice(3, 1);
AppVersionNumber = parseFloat(AppVersionNumber.join(''));

export default {
	ServerRoot: Config ? Config.SERVER_ROOT : ServerRoot,
	AppStore,
	AppName,
	AppDisplayName,
	AppVersion,
	localVersion,
	AppSlogan,
	Build,
	AppVersionNumber
};
