import MainTabNavigator from "./MainTabNavigator";

import LoginScreen from "../screens/login/LoginScreen";
import RetrievePasswordScreen from "../screens/login/RetrievePasswordScreen";
import VerificationScreen from "../screens/login/VerificationScreen";

export default {
	主页: {
		screen: MainTabNavigator
	},
	登录: {
		screen: LoginScreen
	},
	找回密码: {
		screen: RetrievePasswordScreen
	},
	验证: {
		screen: VerificationScreen
	}
};
