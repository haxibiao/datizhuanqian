import React from "react";
import { Platform, Text } from "react-native";
import { TabNavigator } from "react-navigation";

import { Iconfont } from "../utils/Fonts";
import { Colors } from "../constants";

import HomeScreen from "../screens/home/HomeScreen";
import WithDrawsScreen from "../screens/withdraws/HomeScreen";
import TaskScreen from "../screens/task/HomeScreen";
import ProfileScreen from "../screens/profile/HomeScreen";
import PropsLibraryScreen from "../screens/prop/HomeScreen";

import MainTabBar from "./MainTabBar";

let routerConfig = {
  答题: {
    screen: HomeScreen
  },
  道具: {
    screen: PropsLibraryScreen
  },
  任务: {
    screen: TaskScreen
  },
  我的: {
    screen: ProfileScreen
  }
};

export default TabNavigator(routerConfig, {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused }) => {
      const { routeName } = navigation.state;
      let iconName;
      switch (routeName) {
        case "答题":
          iconName = "home";
          break;
        case "道具":
          iconName = "tixian";
          break;
        case "任务":
          iconName = "task";
          break;
        case "我的":
          iconName = "my";
      }
      return <Iconfont name={iconName} size={22} color={focused ? Colors.theme : Colors.grey} />;
    }
  }),
  tabBarComponent: props => <MainTabBar {...props} />,
  tabBarPosition: "bottom",
  animationEnabled: false,
  lazy: false,
  swipeEnabled: Platform.OS === "ios" ? true : false,
  tabBarOptions: {
    activeTintColor: Colors.theme,
    inactiveTintColor: Colors.grey
  }
});
