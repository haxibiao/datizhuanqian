/*
 * @flow
 */

import { NavigationActions } from 'react-navigation';

export * from 'react-navigation-hooks';

let rootNavigation: any = null;

export function setRootNavigation(navigation: any) {
    rootNavigation = navigation;
}

export const middlewareNavigate = (routeName: string, params?: object, action?: any) => {
    const authAction = NavigationActions.navigate({
        routeName: 'Login',
    });
    const navigateAction = NavigationActions.navigate({
        routeName,
        params,
        action,
    });
    if (!TOKEN) {
        rootNavigation.dispatch(authAction);
    } else {
        rootNavigation.dispatch(navigateAction);
    }
};
