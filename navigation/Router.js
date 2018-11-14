import MainTabNavigator from "./MainTabNavigator";

import LoginScreen from "../screens/login/LoginScreen";
import RetrievePasswordScreen from "../screens/login/RetrievePasswordScreen";
import VerificationScreen from "../screens/login/VerificationScreen";

import AnswerScreen from "../screens/home/AnswerScreen";

import SettingScreen from "../screens/profile/settings/HomeScreen";
import FeedBackScreen from "../screens/profile/FeedBackScreen";

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
	},
	答题: {
		screen: AnswerScreen
	},
	设置: {
		screen: SettingScreen
	},
	意见反馈: {
		screen: FeedBackScreen
	}
};
