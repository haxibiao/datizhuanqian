/*
 * @flow
 * created by wyk made in 2018-12-05 20:23:50
 */
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/login';
import AnswerScreen from '../screens/answer';
import SettingScreen from '../screens/setting';
import GradeDescriptionScreen from '../screens/setting/GradeDescription';
import UserProtocolScreen from '../screens/setting/UserProtocol';
import ShareAppScreen from '../screens/setting/ShareApp';
import AboutUsScreen from '../screens/setting/AboutUs';
import WithdrawLogScreen from '../screens/withdraws/WithdrawLog';
import WithdrawLogDetailScreen from '../screens/withdraws/WithdrawLogDetails';
import SubmitTaskScreen from '../screens/task/SubmitTask';

export default {
	Main: {
		screen: MainTabNavigator
	},
	Register: {
		screen: LoginScreen
	},
	Answer: {
		screen: AnswerScreen
	},
	Setting: {
		screen: SettingScreen
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
	WithdrawLog: {
		screen: WithdrawLogScreen
	},
	withdrawLogDetails: {
		screen: WithdrawLogDetailScreen
	},
	SubmitTask: {
		screen: SubmitTaskScreen
	}
};

/*
 * @flow
 * created by wyk made in 2018-12-05 20:23:50
 */
