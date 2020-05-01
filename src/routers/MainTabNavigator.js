/*
 * @Author: Gaoxuan
 * @Date:   2019-08-01 10:20:58
 */

import React from 'react';

import { createBottomTabNavigator } from 'react-navigation';
import { Image } from 'react-native';

import HomeScreen from '../screens/home';
import TaskScreen from '../screens/task';
import WithdrawScreen from '../screens/withdraw';
import ProfileScreen from '../screens/profile';
import MediumScreen from '../screens/video';
import MainTabBar from './MainTabBar';

import { Iconfont } from 'components';

//test
import RankScreen from '../screens/rank';

export default createBottomTabNavigator(
    {
        答题: {
            screen: HomeScreen,
            navigationOptions: () => TabOptions('答题'),
        },
        学习: {
            screen: MediumScreen,
            navigationOptions: () => TabOptions('学习'),
        },
        任务: {
            screen: TaskScreen,
            navigationOptions: () => TabOptions('任务'),
        },
        // 提现: {
        //     screen: WithdrawScreen,
        //     navigationOptions: () => TabOptions('提现'),
        // },
        我的: {
            screen: ProfileScreen,
            navigationOptions: () => TabOptions('我的'),
        },
    },
    {
        initialRouteName: '答题',
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
            inactiveTintColor: '#939393',
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

const TabOptions = (routeName) => {
    const title = routeName;
    const tabBarIcon = ({ focused }: { focused: boolean }) => {
        let height, iconName;
        switch (routeName) {
            case '答题':
                imageUrl = focused
                    ? require('@src/assets/images/ic_tab_home_active.png')
                    : require('@src/assets/images/ic_tab_home_inactive.png');
                break;
            case '学习':
                imageUrl = focused
                    ? require('@src/assets/images/ic_tab_video_active.png')
                    : require('@src/assets/images/ic_tab_video_inactive.png');
                break;
            case '任务':
                imageUrl = focused
                    ? require('@src/assets/images/ic_tab_task_active.png')
                    : require('@src/assets/images/ic_tab_task_inactive.png');
                height = (PxFit(20) * 65) / 54;
                break;
            // case '提现':
            //     imageUrl = `wallet${focused ? '-fill' : ''}`;
            //     iconSize = PxFit(19);
            //     break;
            case '我的':
                imageUrl = focused
                    ? require('@src/assets/images/ic_tab_profile_active.png')
                    : require('@src/assets/images/ic_tab_profile_inactive.png');
                break;
        }
        // return <Iconfont name={iconName} size={iconSize} color={focused ? Theme.primaryColor : Theme.subTextColor} />;
        return <Image source={imageUrl} style={{ width: PxFit(20), height: height || PxFit(20) }} />;
    };
    const tabBarVisible = true;
    return { title, tabBarVisible, tabBarIcon };
};
