/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:24
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, FlatList, Image, Animated } from 'react-native';
import {
	PageContainer,
	TouchFeedback,
	Iconfont,
	Row,
	ListItem,
	CustomSwitch,
	ItemSeparator,
	PopOverlay,
	CustomRefreshControl,
	ListFooter,
	StatusView
} from '../../components';
import { Theme, PxFit, Tools, SCREEN_WIDTH, NAVBAR_HEIGHT } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Storage, ItemKeys } from '../../store/localStorage';
import { Query, withApollo, compose, graphql } from 'react-apollo';
import { UserInfoQuery } from '../../assets/graphql/user.graphql';

import UserProfile from './components/UserProfile';
import QuestionItem from './components/QuestionItem';
import Placeholder from './components/Placeholder';

const HEADER_EXPANDED_HEIGHT = PxFit(158);
const HEADER_COLLAPSED_HEIGHT = 0;

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false
		};
	}

	renderContent = (questions, fetchMore, refetch) => {
		let { navigation } = this.props;
	};

	render() {
		let { navigation } = this.props;
		let user = navigation.getParam('user', {});
		return (
			<Query query={UserInfoQuery} variables={{ id: user.id, order: 'ANSWERS_COUNT', filter: 'publish' }}>
				{({ data, loading, error, refetch, fetchMore }) => {
					let user = Tools.syncGetter('user', data),
						questions = [];
					if (!user) {
						return <Placeholder />;
					}
					if (user && user.questions) {
						questions = user.questions;
					}
					return (
						<PageContainer refetch={refetch} error={error} title={user.name} white>
							<FlatList
								showsVerticalScrollIndicator={false}
								bounces={false}
								contentContainerStyle={{
									paddingBottom: Theme.HOME_INDICATOR_HEIGHT
								}}
								style={styles.container}
								data={questions}
								keyExtractor={(item, index) => index.toString()}
								ListHeaderComponent={<UserProfile user={user} />}
								ListEmptyComponent={<StatusView.EmptyView />}
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
								ListFooterComponent={() => (
									<ListFooter finished={questions.length == 0 || this.state.finished} />
								)}
							/>
						</PageContainer>
					);
				}}
			</Query>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f9f9f9'
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: SCREEN_WIDTH,
		overflow: 'hidden',
		backgroundColor: '#fff'
	}
});

export default compose(
	withApollo,
	connect(store => ({
		user: store.users.user
	}))
)(index);
