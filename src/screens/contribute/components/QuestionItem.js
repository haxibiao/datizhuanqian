/*
 * @flow
 * created by wyk made in 2019-04-15 17:33:41
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text, Image } from 'react-native';
import { Iconfont, Row, PlaceholderImage } from '../../../components';
import { Theme, PxFit, Tools } from '../../../utils';
import Video from 'react-native-video';

class QuestionItem extends Component {
	static defaultProps = {
		question: {}
	};

	submitStatus(submit) {
		console.log('submit', submit);
		switch (submit) {
			case '-2':
				this.Submit = { text: '被驳回', color: Theme.errorColor };
				break;
			case '1':
				this.Submit = { text: '已入库', color: Theme.linkColor };
				break;
			default:
				this.Submit = { text: '审核中', color: Theme.subTextColor };
		}
	}

	render() {
		let { question, navigation } = this.props;
		let { category, image, description, created_at, count, submit, remark, video } = question;
		this.submitStatus(submit);
		return (
			<TouchableWithoutFeedback onPress={() => navigation.navigate('Question', { question })}>
				<View style={styles.questionItem}>
					<View style={styles.questionStatus}>
						<Row style={{ flex: 1 }}>
							<Text style={{ fontSize: PxFit(14), color: this.Submit.color }}>{this.Submit.text}</Text>
							<View style={{ flex: 1, alignItems: 'flex-end', marginLeft: PxFit(10) }}>
								<Text style={styles.metaText}>{created_at}</Text>
							</View>
						</Row>
						{remark && (
							<Text style={styles.remark} numberOfLines={1}>
								原因:{remark}
							</Text>
						)}
					</View>
					<View style={{ padding: PxFit(Theme.itemSpace) }}>
						<View style={styles.questionContent}>
							<View style={{ flex: 1 }}>
								<Text style={styles.subjectText} numberOfLines={3}>
									{description}
								</Text>
							</View>
							{image && <PlaceholderImage source={{ uri: image.path }} style={styles.image} />}
							{video && (
								<View style={styles.image}>
									<Video
										source={{ uri: video.path }}
										style={styles.fullScreen}
										resizeMode="cover"
										paused
										muted
									/>
									<View style={styles.fullScreen}>
										<Iconfont
											name="paused"
											size={PxFit(24)}
											color="#fff"
											style={{ opacity: 0.8 }}
										/>
									</View>
								</View>
							)}
						</View>
						<View style={styles.meta}>
							<Text style={styles.categoryText} numberOfLines={1}>
								#{category.name}
							</Text>
							<Text style={styles.metaText}>{Tools.NumberFormat(count) + '人答过'}</Text>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	questionItem: {
		marginBottom: PxFit(Theme.itemSpace),
		borderRadius: PxFit(5),
		backgroundColor: '#fff'
	},
	questionStatus: {
		paddingVertical: PxFit(10),
		paddingHorizontal: PxFit(Theme.itemSpace),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: '#f0f0f0'
	},
	remark: { fontSize: PxFit(13), color: Theme.errorColor, marginTop: PxFit(5) },
	questionContent: { flexDirection: 'row', alignItems: 'center', marginBottom: PxFit(Theme.itemSpace) },
	categoryText: {
		fontSize: PxFit(14),
		color: Theme.primaryColor,
		borderColor: Theme.primaryColor
	},
	subjectText: {
		fontSize: PxFit(15),
		lineHeight: PxFit(20),
		color: Theme.primaryFont
	},
	image: {
		width: PxFit(60),
		height: PxFit(60),
		borderRadius: PxFit(5),
		resizeMode: 'cover',
		marginLeft: PxFit(12),
		overflow: 'hidden'
	},
	fullScreen: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.2)'
	},
	meta: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	metaText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor
	}
});

export default QuestionItem;
