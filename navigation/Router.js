import MainTabNavigator from "./MainTabNavigator";

import LoginScreen from "../screens/login/LoginScreen";
import RetrievePasswordScreen from "../screens/login/RetrievePasswordScreen";
import VerificationScreen from "../screens/login/VerificationScreen";

import AnswerScreen from "../screens/home/AnswerScreen";

import EditProfileScreen from "../screens/profile/settings/EditProfileScreen";
import SettingScreen from "../screens/profile/settings/HomeScreen";
import AboutScreen from "../screens/profile/settings/AboutScreen";
import ShareScreen from "../screens/profile/settings/ShareScreen";
import FeedBackScreen from "../screens/profile/FeedBackScreen";
import CommonProblemScreen from "../screens/profile/CommonProblemScreen";

import WithdrawalsLogScreen from "../screens/withdrawal/WithdrawalsLogScreen";

export default {
	主页: {
		screen: MainTabNavigator
	},
	登录注册: {
		screen: LoginScreen
	},
	找回密码: {
		screen: RetrievePasswordScreen
	},
	验证: {
		screen: VerificationScreen
	},
	回答: {
		screen: AnswerScreen
	},
	修改个人资料: {
		screen: EditProfileScreen
	},
	关于答题赚钱: {
		screen: AboutScreen
	},
	分享给好友: {
		screen: ShareScreen
	},
	设置: {
		screen: SettingScreen
	},
	意见反馈: {
		screen: FeedBackScreen
	},
	常见问题: {
		screen: CommonProblemScreen
	},
	提现日志: {
		screen: WithdrawalsLogScreen
	}
};