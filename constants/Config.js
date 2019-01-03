import { ServerRoot, AppName, AppVersion, localVersion, AppDisplayName, AppSlogan, Build } from "../app.json";
import Config from "react-native-config";

let AppStore = Config ? Config.APP_STORE : null;

export default {
	ServerRoot: Config ? Config.SERVER_ROOT : ServerRoot,
	AppStore,
	AppName,
	AppDisplayName,
	AppVersion,
	localVersion,
	AppSlogan,
	Build
};
