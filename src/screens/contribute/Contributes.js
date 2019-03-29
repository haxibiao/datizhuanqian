/*
 * @flow
 * created by wyk made in 2019-03-22 16:31:22
 */
'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	Platform,
	View,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback
} from 'react-native';
import {
	PageContainer,
	Iconfont,
	TouchFeedback,
	StatusView,
	Placeholder,
	CustomRefreshControl,
	ItemSeparator,
	ListFooter,
	Row
} from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { mySubmitQuestionHistoryQuery } from '../../assets/graphql/task.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';
import Video from 'react-native-video';

class Contributes extends Component {
	constructor(props) {
		super(props);

		this.state = {
			finished: false
		};
	}

	render() {
		let { navigation } = this.props;

		return (
			<Query query={mySubmitQuestionHistoryQuery} fetchPolicy="network-only">
				{({ data, loading, error, refetch, fetchMore }) => {
					let questions = Tools.syncGetter('user.questions', data);
					let empty = questions && questions.length === 0;
					loading = !questions;
					return (
						<PageContainer title="我的出题" refetch={refetch} loading={loading} empty={empty}>
							<FlatList
								contentContainerStyle={styles.container}
								data={questions}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => (
									<QuestionItem question={item} navigation={navigation} />
								)}
								refreshControl={<CustomRefreshControl onRefresh={refetch} />}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: questions.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (
												!(
													fetchMoreResult &&
													fetchMoreResult.user &&
													fetchMoreResult.user.questions &&
													fetchMoreResult.user.questions.length > 0
												)
											) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												user: Object.assign({}, prev.user, {
													questions: [
														...prev.user.questions,
														...fetchMoreResult.user.questions
													]
												})
											});
										}
									});
								}}
								ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
							/>
						</PageContainer>
					);
				}}
			</Query>
		);
	}
}

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
			<TouchableWithoutFeedback onPress={() => navigation.navigate('QuestionDetail', { question })}>
				<View style={styles.questionItem}>
					<View style={styles.questionStatus}>
						<Row style={{ flex: 1 }}>
							<Text style={{ fontSize: PxFit(14), color: this.Submit.color }}>{this.Submit.text}</Text>
							<View style={{ flex: 1, alignItems: 'flex-end' }}>
								<Text style={styles.categoryText} numberOfLines={1}>
									#{category.name}
								</Text>
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
							<Text style={styles.metaText}>{'  共' + count + '人答过'}</Text>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: PxFit(Theme.itemSpace),
		backgroundColor: '#f9f9f9'
	},
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
		borderColor: Theme.primaryColor,
		marginLeft: PxFit(10)
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

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(Contributes);
