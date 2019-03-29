/*
 * @flow
 * created by wyk made in 2019-03-29 17:04:22
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';

import { TouchFeedback, Avatar, Iconfont, ItemSeparator } from '../../../components';
import { Theme, PxFit } from '../../../utils';

import { connect } from 'react-redux';
import actions from '../../../store/actions';
import { Storage, ItemKeys } from '../../../store/localStorage';

import { Query, ApolloClient, withApollo, compose, graphql } from 'react-apollo';
import { toggleFavoriteMutation } from '../../../assets/graphql/question.graphql';
import Video from 'react-native-video';

class QuestionItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			favorited: props.question.favorite_status
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.question !== this.props.question) {
			this.setState({ favorited: nextProps.question.favorite_status });
		}
	}

	toggleFavorite = async () => {
		let { question, toggleFavorite } = this.props;
		this.setState(prevState => ({ favorited: !prevState.favorited }));
		toggleFavorite({ variables: { data: { favorable_id: question.id } } });
	};

	render() {
		let { favorited } = this.state;
		let { question, navigation, cancelFavorite } = this.props;
		let { category, image, description, video, created_at } = question;
		return (
			<TouchableWithoutFeedback onPress={() => navigation.navigate('QuestionDetail', { question })}>
				<View style={styles.questionItem}>
					<View style={styles.questionCategory}>
						<Text style={styles.categoryText} numberOfLines={1}>
							#{category.name}
						</Text>
					</View>
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
							<Text style={styles.metaText}>{created_at}</Text>
							<TouchFeedback onPress={this.toggleFavorite}>
								<Text style={[styles.metaText, !favorited && { color: Theme.linkColor }]}>
									{favorited ? '取消收藏' : '收藏题目'}
								</Text>
							</TouchFeedback>
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
	questionCategory: {
		paddingVertical: PxFit(10),
		paddingHorizontal: PxFit(Theme.itemSpace),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: '#f0f0f0'
	},
	questionContent: { flexDirection: 'row', alignItems: 'center', marginBottom: PxFit(Theme.itemSpace) },
	categoryText: {
		fontSize: PxFit(14),
		color: Theme.primaryColor,
		borderColor: Theme.primaryColor
	},
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
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	metaText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor
	}
});

export default compose(
	graphql(toggleFavoriteMutation, {
		name: 'toggleFavorite'
	})
)(QuestionItem);
