/*
 * @flow
 * created by wyk made in 2018-12-06 16:01:41
 */
'use strict';

import React from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, WPercent } from '../../utils';
import Button from '../TouchableView/Button';
import SubmitLoading from '../Overlay/SubmitLoading';
import { connect } from 'react-redux';

type Props = {
	title?: string,
	imageSource?: any,
	style?: any,
	titleStyle?: any,
	onPress: Function
};
class ErrorView extends React.Component<Props> {
	state = {
		loading: false
	};

	static defaultProps = {
		title: '哎呀，好像出了点问题',
		imageSource: require('../../assets/images/default_error.png')
	};

	onPress = async () => {
		let { offline, onPress } = this.props;
		if (offline) {
			Toast.show({ content: '网络错误,请检查网络连接' });
			return;
		} else if (onPress) {
			this.setState({ loading: true });
			this.timer = setTimeout(() => {
				this.setState({
					loading: false
				});
			}, 2500);
			onPress();
		}
	};

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	render() {
		let { offline, title, imageSource, style, titleStyle } = this.props;
		imageSource = offline ? require('../../assets/images/default_network.png') : imageSource;
		title = offline ? '网络走丢了' : title;
		return (
			<View style={[styles.container, style]}>
				<TouchableWithoutFeedback onPress={this.onPress}>
					<Image style={styles.image} source={imageSource} />
				</TouchableWithoutFeedback>
				<View style={styles.textWrap}>
					<Text style={[styles.text, titleStyle]}>{title}</Text>
					<Text style={styles.text}>点击图片重试</Text>
				</View>
				<SubmitLoading isVisible={this.state.loading} />
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
		resizeMode: 'cover'
	},
	textWrap: { justifyContent: 'center', alignItems: 'center' },
	text: {
		fontSize: PxFit(14),
		lineHeight: PxFit(18),
		color: Theme.subTextColor
	}
});

export default connect(store => ({ offline: store.app.offline }))(ErrorView);
