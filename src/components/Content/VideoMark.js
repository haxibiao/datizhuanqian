/*
 * @flow
 * created by wyk made in 2018-12-14 14:52:43
 */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Iconfont from '../Iconfont';
import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';

type Props = {
	size?: number,
	style?: any
};

class VideoMark extends Component<Props> {
	static defaultProps = {
		size: PxFit(60)
	};

	render() {
		let { size, style } = this.props;
		return (
			<View style={styles.wrap}>
				<Iconfont name="paused" size={size} color={'#fff'} style={{ opacity: 0.8 }} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrap: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default VideoMark;
