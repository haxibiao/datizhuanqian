/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:55:53
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';

import { Player, overlayView, TouchFeedback, PlaceholderImage, OverlayViewer } from '../../../components';
import { SCREEN_WIDTH, Theme, PxFit, Tools } from '../../../utils';
import ImageViewer from 'react-native-image-zoom-viewer';

class Default extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	showPicture = url => {
		console.log('im,imageageimage', url);
		let overlayView = (
			<ImageViewer onSwipeDown={() => OverlayViewer.hide()} imageUrls={[{ url }]} enableSwipeDown />
		);
		OverlayViewer.show(overlayView);
	};

	showImage = image => {
		let { width, height } = image;
		let style = Tools.singleImageResponse(width, height, SCREEN_WIDTH - PxFit(60));
		return (
			<TouchFeedback style={{ marginTop: PxFit(Theme.itemSpace) }} onPress={() => this.showPicture(image.path)}>
				<PlaceholderImage style={style} source={{ uri: image.path }} />
			</TouchFeedback>
		);
	};

	render() {
		const {
			question: { description, image, video, answer }
		} = this.props;
		return (
			<View style={styles.questionBody}>
				<View>
					<Text style={styles.description}>{'          ' + description}</Text>
					<ImageBackground
						source={require('../../../assets/images/question_type.png')}
						style={styles.imageBG}
					>
						<Text style={styles.answerType}>{answer.length > 1 ? '多选' : '单选'}</Text>
					</ImageBackground>
				</View>
				<View style={styles.contentStyle}>
					{image && this.showImage(image)}
					{video && (
						<View style={{ marginTop: PxFit(Theme.itemSpace) }}>
							<Player width={SCREEN_WIDTH - PxFit(50)} source={video.path} />
						</View>
					)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	questionBody: { marginBottom: PxFit(20) },
	description: {
		color: Theme.defaultTextColor,
		fontSize: PxFit(16),
		lineHeight: PxFit(22)
	},
	imageBG: {
		position: 'absolute',
		top: 2,
		left: 0,
		width: PxFit(36),
		height: PxFit(18),
		justifyContent: 'center',
		alignItems: 'center'
	},
	answerType: {
		fontSize: PxFit(11),
		color: '#fff'
	},
	contentStyle: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	subject: {
		color: Theme.correctColor,
		fontSize: PxFit(16),
		lineHeight: PxFit(22),
		fontWeight: '500'
	}
});

export default Default;
