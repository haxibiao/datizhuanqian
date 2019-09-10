/*
 * @Author: Gaoxuan
 * @Date:   2019-08-01 09:55:03
 */

import { Easing, Animated } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import router from './Router';

const AppRouter = createStackNavigator(router, {
    initialRouteName: 'Main',
    // 使用自定义导航，所以要隐藏默认导航
    defaultNavigationOptions: () => ({
        header: null,
        gesturesEnabled: true,
    }),
    transitionConfig: () => ({
        transitionSpec: {
            duration: 300,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
        },
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const { index } = scene;

            const width = layout.initWidth;
            const translateX = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [width, 0, 0],
            });

            const opacity = position.interpolate({
                inputRange: [index - 1, index - 0.99, index],
                outputRange: [0, 1, 1],
            });

            return { opacity, transform: [{ translateX }] };
        },
    }),
    cardOverlayEnabled: true,
});

export default createAppContainer(AppRouter);
