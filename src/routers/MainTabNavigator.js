import React from 'react';
import { Platform } from 'react-native';
import { StackNavigator, TabBarBottom, createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import { Iconfont } from '../components';
import { Colors } from '../constants';

import HomeScreen from '../screens/home/HomeScreen';
import WithDrawsScreen from '../screens/withdraws/HomeScreen';
import TaskScreen from '../screens/task/HomeScreen';
import ProfileScreen from '../screens/profile/HomeScreen';
import MainTabBar from './MainTabBar';

export default createBottomTabNavigator(
  {
    答题: {
      screen: HomeScreen,
      navigationOptions: () => TabOptions('答题')
    },
    提现: {
      screen: WithDrawsScreen,
      navigationOptions: () => TabOptions('提现')
    },
    任务: {
      screen: TaskScreen,
      navigationOptions: () => TabOptions('任务')
    },
    我的: {
      screen: ProfileScreen,
      navigationOptions: () => TabOptions('我的')
    }
  },
  {
    initialRouteName: '答题',
    lazy: false,
    backBehavior: 'none',
    tabBarComponent: MainTabBar,
    tabBarOptions: {
      safeAreaInset: {
        bottom: 'always',
        top: 'never'
      },
      showLabel: false,
      activeTintColor: Colors.theme,
      inactiveTintColor: Colors.grey
    },
    navigationOptions: ({ navigation }) => {
      const routes = navigation.state.routes;
      const params = routes ? routes[navigation.state.index].params : null;

      const headerTitle = params ? params.title : '';

      const headerTitleStyle = {
        color: 'white',
        flex: 1,
        textAlign: 'center'
      };
      const headerBackTitle = null;
      const headerTintColor = 'white';
      const headerStyle = {
        backgroundColor: Colors.white,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
        elevation: 0
      };
      const header = null;
      return {
        swipeEnabled: true,
        headerTitle,
        headerStyle,
        headerTitleStyle,
        headerBackTitle,
        headerTintColor,
        header
      };
    }
  }
);

const TabOptions = routeName => {
  const title = routeName;
  const tabBarIcon = ({ focused }: { focused: boolean }) => {
    let source;
    switch (routeName) {
      case '答题':
        iconName = 'answer';
        size = 22;
        break;
      case '提现':
        iconName = 'withdraw';
        size = 20;
        break;
      case '任务':
        iconName = 'task3';
        size = 22;
        break;
      case '我的':
        iconName = 'my';
        size = 22;
    }
    return <Iconfont name={iconName} size={size} color={focused ? Colors.theme : Colors.grey} />;
  };
  const tabBarVisible = true;
  return { title, tabBarVisible, tabBarIcon };
};
