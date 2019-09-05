/*
 * @flow
 * created by wyk made in 2019-06-26 16:28:16
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { TouchFeedback, Iconfont, PullChooser, OverlayViewer } from '../../../components';
import { Theme, PxFit } from '../../../utils';
import { observable, action, runInAction, autorun, computed } from 'mobx';
import { observer, Provider, inject } from 'mobx-react';
import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';

@observer
class MediaSelect extends Component {
	showSelected = () => {
		let { contributeStore, type } = this.props;
		let { videoPicke, imagePicke } = contributeStore;

		PullChooser.show([
			{
				title: '视频',
				onPress: () => videoPicke(type)
			},
			{
				title: '图片',
				onPress: () => imagePicke(type)
			}
		]);
	};

	showPicture = url => {
		let overlayView = (
			<ImageViewer
				onSwipeDown={() => OverlayViewer.hide()}
				imageUrls={[
					{
						url
					}
				]}
				enableSwipeDown
			/>
		);
		OverlayViewer.show(overlayView);
	};

	reviewVideo = path => {
		let overlayView = (
			<Video
				source={{
					uri: path
				}}
				style={styles.videoViewer}
				muted={false}
				paused={false}
				resizeMode="contain"
			/>
		);
		OverlayViewer.show(overlayView);
	};

	renderSelect = () => {
		let { contributeStore, type } = this.props;
		if (type === 'explain_') {
			var { explain_picture: picture, explain_video_path: video_path, closeMedia } = contributeStore;
		} else {
			var { picture, video_path, closeMedia } = contributeStore;
		}
		if (picture) {
			return (
				<TouchFeedback onPress={() => this.showPicture(picture)}>
					<Image
						source={{
							uri: picture
						}}
						style={styles.addImage}
					/>
					<TouchableOpacity style={styles.closeBtn} onPress={() => closeMedia(type)}>
						<Iconfont name={'close'} size={PxFit(20)} color="#fff" />
					</TouchableOpacity>
				</TouchFeedback>
			);
		} else if (video_path) {
			return (
				<TouchFeedback onPress={() => this.reviewVideo(video_path)}>
					<Video
						muted
						source={{
							uri: video_path
						}}
						style={styles.addImage}
						resizeMode="cover"
						repeat
					/>
					<TouchableOpacity style={styles.closeBtn} onPress={() => closeMedia(type)}>
						<Iconfont name={'close'} size={PxFit(20)} color="#fff" />
					</TouchableOpacity>
				</TouchFeedback>
			);
		} else {
			return (
				<TouchableOpacity style={styles.addImage} onPress={this.showSelected}>
					<Image
						style={{
							width: PxFit(40),
							height: PxFit(30)
						}}
						source={require('../../../assets/images/camera.png')}
					/>
				</TouchableOpacity>
			);
		}
	};

	render() {
		return <View style={styles.mediaSelect}>{this.renderSelect()}</View>;
	}
}

const styles = StyleSheet.create({
	mediaSelect: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end'
	},
	addImage: {
		width: PxFit(80),
		height: PxFit(80),
		backgroundColor: Theme.groundColour,
		justifyContent: 'center',
		alignItems: 'center'
	},
	closeBtn: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: PxFit(20),
		height: PxFit(20),
		backgroundColor: 'rgba(0,0,0,0.2)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	videoViewer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	}
});

export default inject('contributeStore')(MediaSelect);
