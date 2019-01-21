import React from 'react';
import { Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';

import { Iconfont } from '../components';
import { Colors } from '../constants';

import HomeScreen from '../screens/home/HomeScreen';
import WithDrawsScreen from '../screens/withdraws/HomeScreen';
import TaskScreen from '../screens/task/HomeScreen';
import ProfileScreen from '../screens/profile/HomeScreen';
import MainTabBar from './MainTabBar';

export default TabNavigator(
  {
    答题: {
      screen: HomeScreen
    },
    提现: {
      screen: WithDrawsScreen
    },
    任务: {
      screen: TaskScreen
    },
    我的: {
      screen: ProfileScreen
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        let iconName;
        switch (routeName) {
          case '答题':
            iconName = 'home';
            break;
          case '提现':
            iconName = 'tixian';
            break;
          case '任务':
            iconName = 'task';
            break;
          case '我的':
            iconName = 'my';
        }
        return <Iconfont name={iconName} size={22} color={focused ? Colors.theme : Colors.grey} />;
      }
    }),
    tabBarComponent: props => <MainTabBar {...props} />,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    lazy: false,
    swipeEnabled: Platform.OS === 'ios' ? true : false,
    tabBarOptions: {
      activeTintColor: Colors.theme,
      inactiveTintColor: Colors.grey
    }
  }
);
