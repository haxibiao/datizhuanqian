/*
 * @Author: Gaoxuan
 * @Date:   2019-08-01 10:20:58
 */

import React from 'react';

import { createBottomTabNavigator } from 'react-navigation';

import HomeScreen from '../screens/home';
import TaskScreen from '../screens/task';
import WithdrawScreen from '../screens/withdraw';
import ProfileScreen from '../screens/profile';
import MainTabBar from './MainTabBar';
import { Theme, PxFit } from '../utils';
import { Iconfont } from 'components';

export default createBottomTabNavigator(
    {
        答题: {
            screen: HomeScreen,
            navigationOptions: () => TabOptions('答题'),
        },
        任务: {
            screen: TaskScreen,
            navigationOptions: () => TabOptions('任务'),
        },
        提现: {
            screen: WithdrawScreen,
            navigationOptions: () => TabOptions('提现'),
        },
        我的: {
            screen: ProfileScreen,
            navigationOptions: () => TabOptions('我的'),
        },
    },
    {
        initialRouteName: '提现',
        lazy: false,
        backBehavior: 'none',
        tabBarComponent: MainTabBar,
        tabBarOptions: {
            safeAreaInset: {
                bottom: 'always',
                top: 'never',
            },
            showLabel: false,
            activeTintColor: Theme.primaryColor,
            inactiveTintColor: Theme.subTextColor,
        },
        navigationOptions: ({ navigation }) => {
            const { routes } = navigation.state;
            const params = routes ? routes[navigation.state.index].params : null;

            const headerTitle = params ? params.title : '';

            const headerTitleStyle = {
                color: 'white',
                flex: 1,
                textAlign: 'center',
            };
            const headerBackTitle = null;
            const headerTintColor = 'white';
            const headerStyle = {
                backgroundColor: 'white',
                shadowColor: 'transparent',
                shadowOpacity: 0,
                borderBottomWidth: 0,
                borderBottomColor: 'transparent',
                elevation: 0,
            };
            const header = null;
            return {
                swipeEnabled: true,
                headerTitle,
                headerStyle,
                headerTitleStyle,
                headerBackTitle,
                headerTintColor,
                header,
            };
        },
    },
);

const TabOptions = routeName => {
    const title = routeName;
    const tabBarIcon = ({ focused }: { focused: boolean }) => {
        let iconSize, iconName;
        switch (routeName) {
            case '答题':
                iconName = `brush${focused ? '-fill' : ''}`;
                iconSize = PxFit(23);
                break;
            case '任务':
                iconName = `order${focused ? '-fill' : ''}`;
                iconSize = PxFit(21);
                break;
            case '提现':
                iconName = `wallet${focused ? '-fill' : ''}`;
                iconSize = PxFit(19);
                break;
            case '我的':
                iconName = `person${focused ? '-fill' : ''}`;
                iconSize = PxFit(22);
        }
        return <Iconfont name={iconName} size={iconSize} color={focused ? Theme.primaryColor : Theme.subTextColor} />;
    };
    const tabBarVisible = true;
    return { title, tabBarVisible, tabBarIcon };
};
