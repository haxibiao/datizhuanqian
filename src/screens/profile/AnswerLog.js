/*
 * @flow
 * created by wyk made in 2019-03-22 16:26:54
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
	TouchableWithoutFeedback,
	Animated
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
import { answerHistoriesQuery } from '../../assets/graphql/user.graphql';
import { toggleFavoriteMutation } from '../../assets/graphql/question.graphql';
import { compose, Query, Mutation, graphql } from 'react-apollo';
import Video from 'react-native-video';

class AnswerLog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			finished: false
		};
	}

	render() {
		let { navigation } = this.props;

		return (
			<Query query={answerHistoriesQuery} fetchPolicy="network-only">
				{({ data, loading, error, refetch, fetchMore }) => {
					let answerHistories = Tools.syncGetter('user.answerHistories', data);
					let empty = answerHistories && answerHistories.length === 0;
					loading = !answerHistories;
					return (
						<PageContainer title="答题记录" refetch={refetch} loading={loading} empty={empty}>
							<FlatList
								contentContainerStyle={styles.container}
								data={answerHistories}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => <QuestionItem answer={item} navigation={navigation} />}
								refreshControl={<CustomRefreshControl onRefresh={refetch} />}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: answerHistories.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (
												!(
													fetchMoreResult &&
													fetchMoreResult.user &&
													fetchMoreResult.user.answerHistories &&
													fetchMoreResult.user.answerHistories.length > 0
												)
											) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												user: Object.assign({}, prev.user, {
													answerHistories: [
														...prev.user.answerHistories,
														...fetchMoreResult.user.answerHistories
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
	render() {
		let {
			answer: { question, correct_count },
			navigation,

			index
		} = this.props;
		let { category, description } = question;

		return (
			<TouchableWithoutFeedback onPress={() => navigation.navigate('QuestionDetail', { question })}>
				<View style={styles.answerItem}>
					<View style={styles.content}>
						<View style={{ flex: 1 }}>
							<Text style={styles.subjectText} numberOfLines={3}>
								{description}
							</Text>
						</View>
						<View style={{ alignItems: 'flex-end' }}>
							<TouchableOpacity
								style={{ padding: PxFit(10) }}
								onPress={() => navigation.navigate('QuestionCorrect', { question })}
							>
								<Text style={{ fontSize: PxFit(13), color: Theme.correctColor }}>题目纠错</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View>
						<View style={styles.answer}>
							<Text
								style={[
									styles.answerText,
									{ color: correct_count > 0 ? Theme.correctColor : Theme.errorColor }
								]}
							>
								{correct_count > 0 ? '您答对了' : '您答错了'}
							</Text>
							<Iconfont
								name={correct_count > 0 ? 'correct' : 'close'}
								size={PxFit(20)}
								color={correct_count > 0 ? Theme.correctColor : Theme.errorColor}
							/>
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
		backgroundColor: '#fff'
	},
	answerItem: {
		padding: PxFit(Theme.itemSpace),
		borderBottomWidth: PxFit(10),
		borderColor: '#f9f9f9'
	},
	categoryLabel: {
		alignSelf: 'auto',
		paddingHorizontal: PxFit(4),
		paddingVertical: PxFit(2),
		borderWidth: PxFit(0.5),
		borderRadius: PxFit(3),
		fontSize: PxFit(14),
		color: Theme.primaryColor,
		borderColor: Theme.primaryColor
	},
	content: {
		borderColor: '#f0f0f0',
		borderBottomWidth: PxFit(0.6),
		marginBottom: PxFit(10)
	},
	subjectText: {
		fontSize: PxFit(15),
		lineHeight: PxFit(20),
		color: Theme.primaryFont
	},
	answer: {
		marginTop: PxFit(5),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	answerText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor
	}
});

export default compose(
	connect(store => ({ user: store.users.user, login: store.users.login })),
	graphql(toggleFavoriteMutation, {
		name: 'cancelFavorite'
	})
)(AnswerLog);
