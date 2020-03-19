/*
 * @flow
 */

import { NavigationActions } from 'react-navigation';

export * from 'react-navigation-hooks';

export let rootNavigation: any = null;

export function setRootNavigation(navigation: any) {
    rootNavigation = navigation;
}

export const middlewareNavigate = (routeName: string, params?: object, action?: any) => {
    console.log('routeName', routeName, params);
    const authAction = NavigationActions.navigate({
        routeName: 'Login',
    });
    const navigateAction = NavigationActions.navigate({
        routeName,
        params,
        action,
    });

    rootNavigation.dispatch(navigateAction);
};
