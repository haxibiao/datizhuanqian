/*
 * @flow
 * created by wyk made in 2018-12-05 20:23:50
 */
import MainTabNavigator from './MainTabNavigator';
import { QuestionDetail } from '../components';
import LoginScreen from '../screens/login';
import ForgetPasswordScreen from '../screens/login/ForgetPassword';
import RetrievePasswordScreen from '../screens/login/RetrievePassword';
import AnswerScreen from '../screens/answer';
import CurationScreen from '../screens/answer/Curation';
import RewardScreen from '../screens/answer/Reward';
import TopUpScreen from '../screens/wallet/TopUp';
import PaymentScreen from '../screens/wallet/Payment';
import TopUpLogScreen from '../screens/wallet/TopUpLog';
import TopUpDetailScreen from '../screens/wallet/TopUpDetail';
import ChargeTicketScreen from '../screens/wallet/ChargeTicket';
import IncomeAndExpenditureScreen from '../screens/wallet/IncomeAndExpenditure';
import SettingScreen from '../screens/setting';
import AccountSecurityScreen from '../screens/setting/AccountSecurity';
import GradeDescriptionScreen from '../screens/setting/GradeDescription';
import UserProtocolScreen from '../screens/setting/UserProtocol';
import ShareAppScreen from '../screens/setting/ShareApp';
import AboutUsScreen from '../screens/setting/AboutUs';
import WithdrawsScreen from '../screens/withdraws';
import WithdrawLogDetailScreen from '../screens/withdraws/WithdrawLogDetails';
import SubmitTaskScreen from '../screens/task/SubmitTask';
import SocietyScreen from '../screens/profile/Society';
import EditProfileScreen from '../screens/profile/Edit';
import FavoritesLogScreen from '../screens/profile/FavoritesLog';
import CurationLogScreen from '../screens/profile/CurationLog';
import AnswerLogScreen from '../screens/profile/AnswerLog';
import CommonIssueScreen from '../screens/profile/CommonIssue';
import ModifyAliPayScreen from '../screens/profile/ModifyAliPay';
import ModifyPasswordScreen from '../screens/profile/ModifyPassword';
import VerificationCodeScreen from '../screens/profile/VerificationCode';
import BillingRecordScreen from '../screens/profile/BillingRecord';
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
import PushNotificationScreen from '../screens/notification/PushNotification';
import UserScreen from '../screens/user';

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
	ForgetPassword: {
		screen: ForgetPasswordScreen
	},
	RetrievePassword: {
		screen: RetrievePasswordScreen
	},
	Answer: {
		screen: AnswerScreen,
		path: 'question/:question_id'
	},
	Curation: {
		screen: CurationScreen
	},
	Reward: {
		screen: RewardScreen
	},
	TopUp: {
		screen: TopUpScreen
	},
	Payment: {
		screen: PaymentScreen
	},
	TopUpLog: {
		screen: TopUpLogScreen
	},
	TopUpDetail: {
		screen: TopUpDetailScreen
	},
	ChargeTicket: {
		screen: ChargeTicketScreen
	},
	IncomeAndExpenditure: {
		screen: IncomeAndExpenditureScreen
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
	Withdraws: {
		screen: WithdrawsScreen
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
	CurationLog: {
		screen: CurationLogScreen
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
	VerificationCode: {
		screen: VerificationCodeScreen
	},
	BillingRecord: {
		screen: BillingRecordScreen
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
	},
	PushNotification: {
		screen: PushNotificationScreen
	},
	User: {
		screen: UserScreen
	}
};
