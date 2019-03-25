/*
 * @flow
 * created by wyk made in 2019-03-22 14:03:42
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text, Image, FlatList } from 'react-native';
import {
	PageContainer,
	UserItem,
	TouchFeedback,
	Iconfont,
	Placeholder,
	StatusView,
	ListFooter,
	CustomRefreshControl
} from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH, Tools } from '../../../utils';
import { Query } from 'react-apollo';
import { FollowsQuery } from '../../../assets/graphql/user.graphql';

class Following extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false
		};
	}

	render() {
		let { navigation, user } = this.props;
		return (
			<Query query={FollowsQuery} variables={{ filter: 'users' }} fetchPolicy="network-only">
				{({ loading, error, data, refetch, fetchMore }) => {
					let follows = Tools.syncGetter('follows', data);
					let empty = follows && follows.length === 0;
					loading = !follows;
					return (
						<PageContainer
							hiddenNavBar
							refetch={refetch}
							error={error}
							loading={loading}
							empty={empty}
							loadingSpinner={<Placeholder quantity={10} />}
						>
							<FlatList
								data={follows}
								keyExtractor={(item, index) => index.toString()}
								refreshControl={<CustomRefreshControl onRefresh={refetch} />}
								renderItem={({ item, index }) => (
									<UserItem navigation={navigation} user={item.follow_user} />
								)}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: follows.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (
												!(
													fetchMoreResult &&
													fetchMoreResult.follows &&
													fetchMoreResult.follows.length > 0
												)
											) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												follows: [...prev.follows, ...fetchMoreResult.follows]
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

const styles = StyleSheet.create({});

export default Following;
