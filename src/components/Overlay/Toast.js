/*
 * @flow
 * created by wyk made in 2018-12-06 16:02:28
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { Theme, PxFit, SCREEN_HEIGHT } from '../../utils';
import Iconfont from '../Iconfont';

type positionValue = 'top' | 'center' | 'bottom';

type Option = {
	content: any,
	layout?: positionValue,
	duration?: number,
	callback?: Function
};

type Props = {
	style?: any,
	textStyle?: any,
	fadeInDuration?: number,
	fadeOutDuration?: number,
	showDuration?: number
};

type State = {
	isShow: boolean,
	content: any,
	opacity: any
};

class Toast extends Component<Props, State> {
	static defaultProps = {
		fadeInDuration: 300,
		fadeOutDuration: 400,
		showDuration: 1200
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			isShow: false,
			content: null,
			opacity: new Animated.Value(1)
		};
	}

	show(option: Option) {
		this.positionValue = option.layout || 'center';
		let duration = option.duration || this.props.showDuration;
		let content = option.content;
		let callback = option.callback;
		if (this.isShow) return;
		this.isShow = true;
		this.state.opacity.setValue(0);
		this.setState({ content, isShow: true });
		Animated.sequence([
			Animated.timing(this.state.opacity, {
				toValue: 1,
				duration: this.props.fadeInDuration,
				easing: Easing.linear
			}),
			Animated.delay(duration),
			Animated.timing(this.state.opacity, {
				toValue: 0,
				duration: this.props.fadeOutDuration,
				easing: Easing.linear
			})
		]).start(() => {
			this.setState({ content: null, isShow: false });
			this.isShow = false;
			if (typeof callback === 'function') {
				callback();
			}
		});
	}

	render() {
		let { isShow, opacity, content } = this.state;
		let { style, textStyle } = this.props;
		let position, iconName;
		switch (this.positionValue) {
			case 'top':
				position = { top: PxFit(Theme.navBarContentHeight + 100) };
				break;
			case 'center':
				position = { top: PxFit(SCREEN_HEIGHT - 120) / 2 };
				break;
			case 'bottom':
				position = { bottom: PxFit(Theme.HOME_INDICATOR_HEIGHT + 100) };
				break;
		}
		let ToastView = isShow ? (
			<View style={[styles.container, position]} pointerEvents="none">
				<Animated.View style={[styles.toast, { opacity }, style]}>
					{React.isValidElement(content) ? (
						content
					) : (
						<Text style={[styles.content, textStyle]}>{content}</Text>
					)}
				</Animated.View>
			</View>
		) : null;
		return ToastView;
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		zIndex: 10000,
		alignItems: 'center'
	},
	toast: {
		maxWidth: '50%',
		backgroundColor: 'rgba(32,30,51,0.7)',
		borderRadius: 5,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	content: {
		fontSize: PxFit(14),
		lineHeight: PxFit(18),
		color: '#fff',
		textAlign: 'center'
	}
});

export default Toast;
