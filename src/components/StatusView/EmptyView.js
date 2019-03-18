/*
 * @flow
 * created by wyk made in 2018-12-14 10:44:05
 */
'use strict';

import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, WPercent } from '../../utils';

type Props = {
	title?: string,
	imageSource?: any,
	style?: any,
	titleStyle?: any
};
class EmptyView extends React.Component<Props> {
	static defaultProps = {
		title: '此处空空如也~',
		imageSource: require('../../assets/images/record.jpg')
	};

	render() {
		const { title, imageSource, style, titleStyle } = this.props;

		return (
			<View style={[styles.container, style]}>
				<Image style={styles.image} source={imageSource} />
				<Text style={[styles.title, titleStyle]}>{title}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		minHeight: WPercent(80)
	},
	image: {
		width: WPercent(36),
		height: WPercent(36),
		resizeMode: 'contain'
	},
	title: {
		fontSize: PxFit(12),
		color: Theme.subTextColor,
		marginTop: PxFit(10)
	}
});

export default EmptyView;
