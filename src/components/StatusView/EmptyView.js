/*
 * @flow
 * created by wyk made in 2018-12-14 10:44:05
 */
'use strict';

import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, WPercent } from 'utils';

type Props = {
	title?: string,
	imageSource?: any,
	style?: any,
	titleStyle?: any
};
class EmptyView extends React.Component<Props> {
	static defaultProps = {
		title: '这里什么都没有哦~',
		imageSource: require('../../assets/images/default_content.png')
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
		width: WPercent(44),
		height: WPercent(44),
		resizeMode: 'contain'
	},
	title: {
		fontSize: PxFit(12),
		color: Theme.subTextColor,
		marginTop: PxFit(10)
	}
});

export default EmptyView;
