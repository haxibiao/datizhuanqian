/*
 * @flow
 * created by wyk made in 2019-03-29 17:04:22
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native';

import { Iconfont, PlaceholderImage } from 'components';
import { Theme, PxFit, Tools } from 'utils';

import Video from 'react-native-video';
import { StackActions } from 'react-navigation';

class QuestionItem extends Component {
	constructor(props) {
		super(props);
	}
	renderVideo = () => {
		const {
			question: { description, image, video, answer }
		} = this.props;

		if (video) {
			return (
				<View style={[styles.image, { backgroundColor: '#201e33' }]}>
					<Image source={{ uri: video.cover }} style={{ width: PxFit(60), height: PxFit(60) }} />
					<Iconfont name="paused" size={PxFit(24)} color="#fff" style={styles.fullScreen} />
				</View>
			);
		} else {
			return null;
		}
	};

	render() {
		let { question, navigation } = this.props;
		let { category, image, description } = question;
		const pushAction = StackActions.push({
			routeName: 'Question',
			params: {
				question,
				referrer: 'user'
			}
		});
		return (
			<TouchableWithoutFeedback onPress={() => navigation.dispatch(pushAction)}>
				<View style={styles.questionItem}>
					<View style={{ padding: PxFit(Theme.itemSpace) }}>
						<View style={styles.questionContent}>
							<View style={{ flex: 1 }}>
								<Text style={styles.subjectText} numberOfLines={3}>
									{description}
								</Text>
							</View>
							{image && <PlaceholderImage source={{ uri: image.path }} style={styles.image} />}
							{this.renderVideo()}
						</View>
					</View>
					<View style={styles.meta}>
						<Text style={styles.categoryText} numberOfLines={1}>
							#{category.name}
						</Text>
						<Text style={styles.metaText}>{Tools.NumberFormat(question.count)}人答过</Text>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	questionItem: {
		margin: PxFit(Theme.itemSpace),
		marginBottom: 0,
		borderRadius: PxFit(5),
		backgroundColor: '#fff'
	},
	questionContent: { flexDirection: 'row', alignItems: 'center' },
	subjectText: {
		fontSize: PxFit(15),
		lineHeight: PxFit(20),
		color: Theme.defaultTextColor
	},
	image: {
		width: PxFit(60),
		height: PxFit(60),
		borderRadius: PxFit(5),
		resizeMode: 'cover',
		marginLeft: PxFit(12)
	},
	fullScreen: {
		position: 'absolute',
		top: PxFit(18),
		left: PxFit(18),
		bottom: 0,
		right: 0
	},
	iconCover: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
		borderRadius: PxFit(5)
	},
	meta: {
		borderTopWidth: PxFit(0.5),
		borderColor: Theme.borderColor,
		paddingVertical: PxFit(10),
		paddingHorizontal: PxFit(Theme.itemSpace),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	categoryText: {
		fontSize: PxFit(14),
		color: Theme.primaryColor,
		borderColor: Theme.primaryColor
	},
	metaText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor
	}
});

export default QuestionItem;
