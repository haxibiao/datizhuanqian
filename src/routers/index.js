/*
 * @flow
 * created by wyk made in 2018-12-05 20:26:05
 */
'use strict';
import React, { Component } from 'react';
import { Platform, Easing, Animated } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import router from './router';

let AppRouter = createStackNavigator(router, {
	initialRouteName: '主页',
	// 使用自定义导航，所以要隐藏默认导航
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
	}),
	cardOverlayEnabled: true
});

export default createAppContainer(AppRouter);
