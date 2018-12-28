import MainTabNavigator from "./MainTabNavigator";

import LoginScreen from "../screens/login/LoginScreen";
import RetrievePasswordScreen from "../screens/login/RetrievePasswordScreen";
import VerificationScreen from "../screens/login/VerificationScreen";

import AnswerScreen from "../screens/home/AnswerScreen";
import ErrorCorrectionScreen from "../screens/home/ErrorCorrectionScreen";

import EditProfileScreen from "../screens/profile/settings/EditProfileScreen";
import MyAccountScreen from "../screens/profile/settings/MyAccountScreen";
import SettingScreen from "../screens/profile/settings/HomeScreen";
import AboutScreen from "../screens/profile/settings/AboutScreen";
import FeedBackScreen from "../screens/profile/feedBack/HomeScreen";

import ShareScreen from "../screens/profile/settings/ShareScreen";
import LevelDescriptionScreen from "../screens/profile/settings/LevelDescriptionScreen";
import UserAgreenmentScreen from "../screens/profile/settings/UserAgreenmentScreen";

import GoFeedBackScreen from "../screens/profile/FeedBackScreen";
import CommonIssueScreen from "../screens/profile/CommonIssueScreen";
import ChangePasswordScreen from "../screens/profile/settings/ChangePasswordScreen";
import MyPropScreen from "../screens/profile/MyPropScreen";

import Notification from "../screens/notification/HomeScreen";

import WithdrawsLogScreen from "../screens/withdraws/WithdrawsLogScreen";

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
	用户协议: {
		screen: UserAgreenmentScreen
	},
	题目纠错: {
		screen: ErrorCorrectionScreen
	},
	编辑个人资料: {
		screen: EditProfileScreen
	},
	我的账户: {
		screen: MyAccountScreen
	},
	关于答题赚钱: {
		screen: AboutScreen
	},
	分享给好友: {
		screen: ShareScreen
	},
	等级说明: {
		screen: LevelDescriptionScreen
	},
	设置: {
		screen: SettingScreen
	},
	意见反馈: {
		screen: FeedBackScreen
	},
	问题反馈: {
		screen: GoFeedBackScreen
	},
	我的道具: {
		screen: MyPropScreen
	},
	常见问题: {
		screen: CommonIssueScreen,
		path: "demo/problem"
	},
	重置密码: {
		screen: ChangePasswordScreen
	},
	通知: {
		screen: Notification
	},
	提现日志: {
		screen: WithdrawsLogScreen
	}
};
