/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:24
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, FlatList, Image } from 'react-native';
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
	ListFooter
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

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false
		};
	}

	renderContent = (questions, fetchMore, refetch) => {
		let { navigation } = this.props;
		if (!questions) {
			return <View />;
		}
		return (
			<FlatList
				contentContainerStyle={styles.container}
				data={questions}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item, index }) => <QuestionItem question={item} navigation={navigation} />}
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
									questions: [...prev.user.questions, ...fetchMoreResult.user.questions]
								})
							});
						}
					});
				}}
				ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
			/>
		);
	};

	render() {
		let { navigation } = this.props;
		let user = navigation.getParam('user', {});
		return (
			<Query query={UserInfoQuery} variables={{ id: user.id, order: 'ANSWERS_COUNT', filter: 'publish' }}>
				{({ data, loading, error, refetch, fetchMore }) => {
					let user = Tools.syncGetter('user', data);
					if (!user) {
						return <Placeholder />;
					}
					return (
						<PageContainer refetch={refetch} error={error} title={user.name} white>
							<UserProfile user={user} />
							{this.renderContent(user.questions, fetchMore, refetch)}
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
		padding: PxFit(Theme.itemSpace),
		backgroundColor: '#f9f9f9'
	}
});

export default compose(
	withApollo,
	connect(store => ({
		user: store.users.user
	}))
)(index);
