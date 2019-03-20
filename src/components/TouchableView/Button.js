/*
 * @flow
 * created by wyk made in 2018-12-07 16:38:12
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Platform, View, Text } from 'react-native';
import { PxFit, Theme, ISAndroid } from '../../utils';

type ButtonSize = 'default' | 'small' | 'large';

type Props = {
	size?: ButtonSize,
	title: any,
	...TouchableWithoutFeedback.propTypes
};

class Button extends Component {
	static defaultProps = {
		size: 'default',
		activeOpacity: 0.6,
		hitSlop: { top: 12, bottom: 12, left: 8, right: 8 }
	};

	buildProps() {
		let { size, style, disabled, title, children, ...others } = this.props;
		let borderRadius, paddingVertical, paddingHorizontal, textFontSize, titleStyle;
		let borderColor = Theme.primaryColor;
		let textColor = '#fff';
		switch (size) {
			case 'large':
				borderRadius = PxFit(6);
				paddingVertical = PxFit(8);
				paddingHorizontal = PxFit(20);
				textFontSize = PxFit(20);
				break;
			case 'small':
				borderRadius = PxFit(3);
				paddingVertical = PxFit(2);
				paddingHorizontal = PxFit(4);
				textFontSize = PxFit(10);
				break;
			default:
				borderRadius = PxFit(4);
				paddingVertical = PxFit(6);
				paddingHorizontal = PxFit(12);
				textFontSize = PxFit(14);
		}
		style = {
			borderColor,
			borderRadius,
			paddingVertical,
			paddingHorizontal,
			overflow: 'hidden',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			...style
		};
		if (disabled) {
			style.opacity = 0.65;
		}
		if (!React.isValidElement(title)) {
			titleStyle = {
				color: textColor,
				fontSize: textFontSize,
				overflow: 'hidden'
			};
			title = (
				<Text style={titleStyle} numberOfLines={1}>
					{title}
				</Text>
			);
		}
		if (!children) children = title;
		return { style, children, disabled, ...others };
	}

	render() {
		let { children, style, ...others } = this.buildProps();
		return (
			<View style={style}>
				<TouchableOpacity style={styles.touch} {...others}>
					{children}
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	backgroundView: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	touch: { flex: 1, alignItems: 'center' }
});

export default Button;
