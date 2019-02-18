import React from 'react';
import { Animated, Easing } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import router from './Router';

const MainStack = createStackNavigator(router, {
  navigationOptions: ({ navigation }) => {
    return {
      header: null
    };
  },
  defaultNavigationOptions: () => ({
    header: null,
    gesturesEnabled: true
  }),
  transitionConfig: () => ({
    transitionSpec: {
      duration: 300,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;
      const { index } = scene;

      const width = layout.initWidth;
      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [width, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateX }] };
    }
  })
});

const AppContainer = createAppContainer(MainStack);

export default AppContainer;
