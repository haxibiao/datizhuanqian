/*
 * @flow
 * created by wyk made in 2019-03-29 15:47:49
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
class AnswerEnd extends React.Component<Props> {
	static defaultProps = {
		title: '这里什么都没有哦~',
		imageSource: require('../../assets/images/default_xxxx.png')
	};

	render() {
		const { title, imageSource, style, titleStyle } = this.props;

		return (
			<View style={[styles.container, style]}>
				<Image style={styles.image} source={imageSource} />
				<Text style={[styles.title, titleStyle]}>您以及答完了下的题目，真是太厉害啦~</Text>
				<Text style={[styles.title, titleStyle]}>去其它分类下继续答题吧~</Text>
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
		width: WPercent(50),
		height: WPercent(50),
		resizeMode: 'contain'
	},
	title: {
		fontSize: PxFit(12),
		color: Theme.subTextColor,
		marginTop: PxFit(10)
	}
});

export default AnswerEnd;
