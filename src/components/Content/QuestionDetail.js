/*
 * @flow
 * created by wyk made in 2019-03-25 10:52:46
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Theme, PxFit, Config, Tools, SCREEN_WIDTH } from '../../utils';

import PlaceholderImage from '../Basics/PlaceholderImage';
import PageContainer from '../Container/PageContainer';
import TouchFeedback from '../TouchableView/TouchFeedback';
import OverlayViewer from '../Overlay/OverlayViewer';
import Iconfont from '../Iconfont';
import Player from '../Media/Player';
import OptionItem from './OptionItem';

import ImageViewer from 'react-native-image-zoom-viewer';

class QuestionDetail extends Component {
	showPicture = url => {
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
		let { navigation } = this.props;
		let { description, image, selections_array, category, answer, video } = navigation.getParam('question', {});
		return (
			<PageContainer title="题目详情">
				<ScrollView
					style={styles.container}
					contentContainerStyle={{ flexGrow: 1, paddingBottom: Theme.HOME_INDICATOR_HEIGHT }}
				>
					<View style={{ paddingTop: PxFit(20), paddingHorizontal: PxFit(Theme.itemSpace) }}>
						<View style={{ marginBottom: PxFit(20) }}>
							<View>
								<Text style={styles.description}>
									<Text style={styles.subject}>{'题干:  '}</Text>
									{description}
								</Text>
								{
									// answer && (
									// <ImageBackground
									// 	source={require('../../assets/images/question_type.png')}
									// 	style={styles.imageBG}
									// >
									// 	<Text style={styles.answerType}>{answer.length > 1 ? '多选' : '单选'}</Text>
									// </ImageBackground>
									// )
								}
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
						<View style={styles.options}>
							{selections_array.map((option, index) => {
								return (
									<OptionItem
										key={index}
										style={{ marginBottom: PxFit(20) }}
										option={option}
										isAnswer={answer && answer.includes(option.Value)}
									/>
								);
							})}
						</View>
					</View>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	subject: {
		color: Theme.correctColor,
		fontSize: PxFit(16),
		lineHeight: PxFit(22),
		fontWeight: '500'
	},
	description: {
		color: Theme.defaultTextColor,
		fontSize: PxFit(16),
		lineHeight: PxFit(22)
	},
	contentStyle: {
		alignItems: 'center',
		justifyContent: 'center'
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
	options: {
		marginHorizontal: PxFit(10)
	}
});

export default QuestionDetail;
