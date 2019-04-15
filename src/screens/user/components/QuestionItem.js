/*
 * @flow
 * created by wyk made in 2019-03-29 17:04:22
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';

import { TouchFeedback, Avatar, Iconfont, ItemSeparator } from '../../../components';
import { Theme, PxFit, Tools } from '../../../utils';

import { connect } from 'react-redux';
import actions from '../../../store/actions';
import { Storage, ItemKeys } from '../../../store/localStorage';

import { Query, ApolloClient, withApollo, compose, graphql } from 'react-apollo';
import { toggleFavoriteMutation } from '../../../assets/graphql/question.graphql';
import Video from 'react-native-video';

class QuestionItem extends Component {
	render() {
		let { question, navigation } = this.props;
		let { category, image, description, video, created_at } = question;
		return (
			<TouchableWithoutFeedback onPress={() => navigation.navigate('Question', { question })}>
				<View style={styles.questionItem}>
					<View style={{ padding: PxFit(Theme.itemSpace) }}>
						<View style={styles.questionContent}>
							<View style={{ flex: 1 }}>
								<Text style={styles.subjectText} numberOfLines={3}>
									{description}
								</Text>
							</View>
							{image && <Image source={{ uri: image.path }} style={styles.image} />}
							{video && (
								<View style={styles.image}>
									<Video
										source={{ uri: video.path }}
										style={styles.fullScreen}
										resizeMode="cover"
										paused
										muted={false}
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
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.2)'
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
