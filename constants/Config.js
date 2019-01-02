import { ServerRoot, AppName, AppVersion, localVersion, AppDisplayName, AppSlogan } from '../app.json';
import Config from 'react-native-config';

export default {
	ServerRoot: Config.SERVER_ROOT,
	AppStore: Config.APP_STORE,
	AppName,
	AppDisplayName,
	AppVersion,
	localVersion,
	AppSlogan
};
