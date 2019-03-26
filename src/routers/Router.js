/*
 * @flow
 * created by wyk made in 2018-12-05 20:23:50
 */
import MainTabNavigator from './MainTabNavigator';
import { QuestionDetail } from '../components';
import LoginScreen from '../screens/login';
import AnswerScreen from '../screens/answer';
import CurationScreen from '../screens/answer/Curation';
import SettingScreen from '../screens/setting';
import AccountSecurityScreen from '../screens/setting/AccountSecurity';
import GradeDescriptionScreen from '../screens/setting/GradeDescription';
import UserProtocolScreen from '../screens/setting/UserProtocol';
import ShareAppScreen from '../screens/setting/ShareApp';
import AboutUsScreen from '../screens/setting/AboutUs';
import WalletScreen from '../screens/wallet';
import WithdrawLogScreen from '../screens/withdraws/WithdrawLog';
import WithdrawLogDetailScreen from '../screens/withdraws/WithdrawLogDetails';
import SubmitTaskScreen from '../screens/task/SubmitTask';
import SocietyScreen from '../screens/profile/Society';
import EditProfileScreen from '../screens/profile/Edit';
import FavoritesLogScreen from '../screens/profile/FavoritesLog';
import CorrectLogScreen from '../screens/profile/CorrectLog';
import AnswerLogScreen from '../screens/profile/AnswerLog';
import CommonIssueScreen from '../screens/profile/CommonIssue';
import ModifyAliPayScreen from '../screens/profile/ModifyAliPay';
import ModifyPasswordScreen from '../screens/profile/ModifyPassword';
import FeedbackScreen from '../screens/feedback';
import FeedbackDetails from '../screens/feedback/FeedbackDetails';
import ContributeScreen from '../screens/contribute';
import ContributesScreen from '../screens/contribute/Contributes';
import ContributeRuleScreen from '../screens/contribute/ContributeRule';
import ContributeSubmitedScreen from '../screens/contribute/Submit';
import NotificationScreen from '../screens/notification';
import SystemNotificationScreen from '../screens/notification/SystemNotification';
import CommentNotificationScreen from '../screens/notification/CommentNotification';
import FansNotificationScreen from '../screens/notification/FansNotification';

export default {
	Main: {
		screen: MainTabNavigator
	},
	QuestionDetail: {
		screen: QuestionDetail
	},
	Register: {
		screen: LoginScreen
	},
	Answer: {
		screen: AnswerScreen,
		path: 'question/:question_id'
	},
	Curation: {
		screen: CurationScreen
	},
	// setting
	Setting: {
		screen: SettingScreen
	},
	AccountSecurity: {
		screen: AccountSecurityScreen
	},
	GradeDescription: {
		screen: GradeDescriptionScreen
	},
	UserProtocol: {
		screen: UserProtocolScreen
	},
	ShareApp: {
		screen: ShareAppScreen
	},
	AboutUs: {
		screen: AboutUsScreen
	},
	Wallet: {
		screen: WalletScreen
	},
	WithdrawLog: {
		screen: WithdrawLogScreen
	},
	withdrawLogDetails: {
		screen: WithdrawLogDetailScreen
	},
	SubmitTask: {
		screen: SubmitTaskScreen
	},
	Society: {
		screen: SocietyScreen
	},
	EditProfile: {
		screen: EditProfileScreen
	},
	FavoritesLog: {
		screen: FavoritesLogScreen
	},
	CorrectLog: {
		screen: CorrectLogScreen
	},
	AnswerLog: {
		screen: AnswerLogScreen
	},
	CommonIssue: {
		screen: CommonIssueScreen,
		path: 'app/CommonIssue'
	},
	ModifyAliPay: {
		screen: ModifyAliPayScreen
	},
	ModifyPassword: {
		screen: ModifyPasswordScreen
	},
	Feedback: {
		screen: FeedbackScreen
	},
	FeedbackDetails: {
		screen: FeedbackDetails
	},
	Contribute: {
		screen: ContributeScreen
	},
	Contributes: {
		screen: ContributesScreen
	},
	ContributeRule: {
		screen: ContributeRuleScreen
	},
	ContributeSubmited: {
		screen: ContributeSubmitedScreen
	},
	Notification: {
		screen: NotificationScreen
	},
	SystemNotification: {
		screen: SystemNotificationScreen
	},
	CommentNotification: {
		screen: CommentNotificationScreen
	},
	FansNotification: {
		screen: FansNotificationScreen
	}
};
