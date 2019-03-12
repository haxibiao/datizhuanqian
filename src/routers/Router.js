import MainTabNavigator from './MainTabNavigator';

import LoginScreen from '../screens/login/LoginScreen';
import RetrievePasswordScreen from '../screens/login/RetrievePasswordScreen';
import VerificationScreen from '../screens/login/VerificationScreen';

import AnswerScreen from '../screens/home/AnswerScreen';
import ErrorCorrectionScreen from '../screens/home/ErrorCorrectionScreen';

import SettingScreen from '../screens/profile/settings/HomeScreen';
import EditProfileScreen from '../screens/profile/settings/EditProfileScreen';
import MyAccountScreen from '../screens/profile/settings/MyAccountScreen';
import VerificationCodeScreen from '../screens/profile/settings/VerificationCodeScreen';
import AboutScreen from '../screens/profile/settings/AboutScreen';
import UserAgreenmentScreen from '../screens/profile/settings/UserAgreenmentScreen';
import ShareScreen from '../screens/profile/settings/ShareScreen';
import LevelDescriptionScreen from '../screens/profile/settings/LevelDescriptionScreen';
import ChangePasswordScreen from '../screens/profile/settings/ChangePasswordScreen';

import GoFeedBackScreen from '../screens/profile/FeedBackScreen';
import CommonIssueScreen from '../screens/profile/CommonIssueScreen';
import MyPropScreen from '../screens/profile/MyPropScreen';
import TestScreen from '../screens/profile/TestScreen';
import BusinessScreen from '../screens/profile/BusinessScreen';
import CorrectionLogScreen from '../screens/profile/CorrectionLogScreen';
import AnswerLogScreen from '../screens/profile/AnswerLogScreen';
import MyFavoritesScreen from '../screens/profile/MyFavoritesScreen';
import FollowFans from '../screens/profile/followFans';

import FeedbackScreen from '../screens/feedback/HomeScreen';
import FeedbackDetailsScreen from '../screens/feedback/FeedbackDetailsScreen';

import NotificationScreen from '../screens/notification/HomeScreen';
import SystemNotificationScreen from '../screens/notification/SystemNotificationScreen';
import CommentNotificationScreen from '../screens/notification/CommentNotificationScreen';
import FansNotificationScreen from '../screens/notification/FansNotificationScreen';

import WithdrawsLogScreen from '../screens/withdraws/WithdrawsLogScreen';
import WithdrawDetailsScreen from '../screens/withdraws/WithdrawDetailsScreen';
import WithdrawApplyScreen from '../screens/withdraws/WithdrawApplyScreen';

import SubmitTaskScreen from '../screens/task/SubmitTaskScreen';
import TaskDetailsScreen from '../screens/task/TaskDetailsScreen';
import TaskFailScreen from '../screens/task/TaskFailScreen';
import MakeQuestionScreen from '../screens/task/MakeQuestionScreen';
import MakeQuestionHistoryScreen from '../screens/task/MakeQuestionHistoryScreen';
import QuestionDetail from '../screens/task/QuestionDetail';
import MakeQuestionRule from '../screens/task/MakeQuestionRule';

import PropScreen from '../screens/prop/HomeScreen';

import User from '../screens/user';

export default {
	主页: {
		screen: MainTabNavigator
	},
	//mainTab
	登录注册: {
		screen: LoginScreen
	},
	重置密码: {
		screen: RetrievePasswordScreen
	},
	忘记密码: {
		screen: VerificationScreen
	},
	//登录注册
	回答: {
		screen: AnswerScreen
	},
	题目纠错: {
		screen: ErrorCorrectionScreen
	},
	//答题
	设置: {
		screen: SettingScreen
	},
	编辑个人资料: {
		screen: EditProfileScreen
	},
	我的账户: {
		screen: MyAccountScreen
	},
	验证: {
		screen: VerificationCodeScreen
	},
	关于答题赚钱: {
		screen: AboutScreen
	},
	用户协议: {
		screen: UserAgreenmentScreen
	},
	分享给好友: {
		screen: ShareScreen
	},
	等级说明: {
		screen: LevelDescriptionScreen
	},
	修改密码: {
		screen: ChangePasswordScreen
	},
	//设置页
	我的道具: {
		screen: MyPropScreen
	},
	常见问题: {
		screen: CommonIssueScreen,
		path: 'demo/problem'
	},
	商务合作: {
		screen: BusinessScreen
	},
	//我的
	意见反馈: {
		screen: FeedbackScreen
	},
	问题反馈: {
		screen: GoFeedBackScreen
	},
	反馈详情: {
		screen: FeedbackDetailsScreen
	},
	纠题记录: {
		screen: CorrectionLogScreen
	},
	答题记录: {
		screen: AnswerLogScreen
	},
	我的收藏: {
		screen: MyFavoritesScreen
	},
	关注粉丝: {
		screen: FollowFans
	},
	//反馈
	通知: {
		screen: NotificationScreen
	},
	系统通知: {
		screen: SystemNotificationScreen
	},
	评论通知: {
		screen: CommentNotificationScreen
	},
	粉丝通知: {
		screen: FansNotificationScreen
	},
	//通知
	提现日志: {
		screen: WithdrawsLogScreen
	},
	提现详情: {
		screen: WithdrawDetailsScreen
	},
	提现申请: {
		screen: WithdrawApplyScreen
	},
	测试: {
		screen: TestScreen
	},
	//提现
	提交任务: {
		screen: SubmitTaskScreen
	},
	任务详情: {
		screen: TaskDetailsScreen
	},
	失败详情: {
		screen: TaskFailScreen
	},
	问题创建: {
		screen: MakeQuestionScreen
	},
	我的出题: {
		screen: MakeQuestionHistoryScreen
	},
	题目详情: {
		screen: QuestionDetail
	},
	出题规则: {
		screen: MakeQuestionRule
	},
	//任务
	道具: {
		screen: PropScreen
	},
	用户资料: {
		screen: User
	}
};
