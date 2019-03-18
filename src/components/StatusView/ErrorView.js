/*
 * @flow
 * created by wyk made in 2018-12-06 16:01:41
 */
'use strict';

import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, WPercent } from '../../utils';
import Button from '../TouchableView/Button';
import { connect } from 'react-redux';

type Props = {
	title?: string,
	imageSource?: any,
	style?: any,
	titleStyle?: any,
	onPress: Function
};
class ErrorView extends React.Component<Props> {
	static defaultProps = {
		title: '页面出错啦',
		imageSource: require('../../assets/images/error.png')
	};

	onPress = () => {
		if (this.props.app.offline) {
			Toast.show({ content: '网络连接错误' });
			return;
		}
		this.props.onPress && this.props.onPress();
	};

	render() {
		const { title, imageSource, style, titleStyle } = this.props;

		return (
			<View style={[styles.container, style]}>
				<Image style={styles.image} source={imageSource} />
				<Text style={[styles.title, titleStyle]}>{title}</Text>
				<Button style={styles.button} onPress={this.onPress}>
					<Text style={styles.buttonText}>点击重试</Text>
				</Button>
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
		resizeMode: 'cover'
	},
	title: {
		fontSize: PxFit(12),
		marginTop: PxFit(10),
		color: Theme.subTextColor
	},
	button: {
		maxWidth: '60%',
		height: PxFit(44),
		borderRadius: PxFit(6),
		marginTop: PxFit(40),
		borderWidth: 0
	},
	buttonText: {
		fontSize: PxFit(14),
		color: '#fff'
	}
});

export default connect(store => ({ app: store.app }))(ErrorView);
