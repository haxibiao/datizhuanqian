/*
 * @flow
 * created by wyk made in 2019-06-27 14:10:04
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { observer, Provider, inject } from 'mobx-react';
import { TouchFeedback, Row, VideoMark } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { withNavigation } from 'react-navigation';

const MEDIA_WIDTH = SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2 - PxFit(12) * 2;

class VideoExplain extends Component {
	render() {
		let { video, navigation } = this.props;
		if (!video) {
			return null;
		}
		return (
			<View style={styles.shadowView} elevation={10}>
				<View style={styles.shadowTitle}>
					<Row>
						<View style={styles.yellowDot} />
						<Text style={styles.titleText}>视频解析</Text>
					</Row>
				</View>
				<TouchableWithoutFeedback onPress={() => navigation.navigate('VideoExplanation', { video })}>
					<View style={styles.mediaWrap}>
						<Image
							source={require('../../../assets/images/video_explain.jpg')}
							style={styles.pictureStyle}
						/>
						<VideoMark size={PxFit(60)} />
					</View>
				</TouchableWithoutFeedback>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	shadowView: {
		marginBottom: PxFit(20),
		padding: PxFit(12),
		borderRadius: PxFit(5),
		backgroundColor: '#fff',
		shadowColor: '#b4b4b4',
		shadowOffset: {
			width: 0,
			height: 0
		},
		shadowRadius: 1,
		shadowOpacity: 0.3
	},
	shadowTitle: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: PxFit(Theme.itemSpace)
	},
	yellowDot: {
		marginRight: PxFit(6),
		width: PxFit(6),
		height: PxFit(6),
		borderRadius: PxFit(3),
		backgroundColor: Theme.primaryColor
	},
	titleText: {
		fontSize: PxFit(14),
		color: Theme.defaultTextColor
	},
	mediaWrap: {
		width: MEDIA_WIDTH,
		height: MEDIA_WIDTH * 0.6,
		justifyContent: 'center',
		alignItems: 'center'
	},
	pictureStyle: {
		position: 'absolute',
		width: null,
		height: null,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default withNavigation(VideoExplain);
