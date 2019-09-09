/*
 * @flow
 * created by wyk made in 2019-02-02 09:25:09
 */
import { NavigationActions } from 'react-navigation';

let rootNavigation = null;

export function setRootNavigation(navigation: any) {
	rootNavigation = navigation;
}

export const navigate = (routeName: string, params?: object, action?: any) => {
	const navigateAction = NavigationActions.navigate({
		routeName,
		params,
		action
	});
	rootNavigation.dispatch(navigateAction);
};
