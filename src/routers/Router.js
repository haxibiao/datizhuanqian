/*
 * @flow
 * created by wyk made in 2018-12-05 20:23:50
 */
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/login';
import AnswerScreen from '../screens/answer';

export default {
	Main: {
		screen: MainTabNavigator
	},
	Register: {
		screen: LoginScreen
	},
	Answer: {
		screen: AnswerScreen
	}
};
