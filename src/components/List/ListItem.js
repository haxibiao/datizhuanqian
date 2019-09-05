/*
 * @flow
 * created by wyk made in 2018-12-14 16:06:39
 */
'use strict';

import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';
import { Theme, PxFit } from '../../utils';
import SafeText from '../Basics/SafeText';
import TouchFeedback from '../TouchableView/TouchFeedback';

type Props = {
	disabled: ?boolean,
	style?: style,
	leftComponent?: any,
	onPress?: Function,
	middleStyle?: any,
	title?: string,
	titleStyle?: any,
	subTitle?: string,
	subTitleStyle?: any,
	rightComponent?: any
};

class ListItem extends Component<Props> {
	static defaultProps = {
		onPress: () => null
	};

	render() {
		let {
			disabled,
			style,
			leftComponent,
			rightComponent,
			title,
			subTitle,
			onPress,
			middleStyle,
			titleStyle,
			subTitleStyle
		} = this.props;
		style = {
			flexDirection: 'row',
			alignItems: 'center',
			...style
		};
		middleStyle = {
			flex: 1,
			marginHorizontal: PxFit(Theme.itemSpace),
			...middleStyle
		};
		titleStyle = {
			fontSize: PxFit(16),
			color: Theme.highlightTextColor,
			...titleStyle
		};
		subTitleStyle = {
			marginTop: PxFit(6),
			fontSize: PxFit(13),
			color: '#999',
			...subTitleStyle
		};
		return (
			<TouchFeedback onPress={onPress} disabled={disabled}>
				<View style={style}>
					<View>{leftComponent}</View>
					<View style={middleStyle}>
						<SafeText style={titleStyle} numberOfLines={1}>
							{title}
						</SafeText>
						<SafeText style={subTitleStyle} numberOfLines={1}>
							{subTitle}
						</SafeText>
					</View>
					<View>{rightComponent}</View>
				</View>
			</TouchFeedback>
		);
	}
}

const styles = StyleSheet.create({});

export default ListItem;
