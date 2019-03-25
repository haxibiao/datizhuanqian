/*
 * @flow
 * created by wyk made in 2019-03-22 14:03:29
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
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';
import { Query } from 'react-apollo';
import { FollowersQuery } from '../../../assets/graphql/user.graphql';

class Follower extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false
		};
	}

	render() {
		let { navigation, user } = this.props;
		return (
			<Query query={FollowersQuery} variables={{ filter: 'users' }} fetchPolicy="network-only">
				{({ loading, error, data, refetch, fetchMore }) => {
					let followers;
					if (!(data && data.followers)) {
						return <Placeholder quantity={10} />;
					} else if (data.followers.length === 0) {
						return <StatusView.EmptyView />;
					} else {
						followers = data.followers;
					}
					console.log('test followers', followers);
					return (
						<PageContainer error={error} hiddenNavBar>
							<FlatList
								data={followers}
								keyExtractor={(item, index) => index.toString()}
								refreshControl={<CustomRefreshControl onRefresh={refetch} />}
								renderItem={({ item, index }) => <UserItem navigation={navigation} user={item.user} />}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									console.log('followers', followers);
									fetchMore({
										variables: {
											offset: followers.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											console.log('updateQuery', fetchMoreResult);

											if (
												!(
													fetchMoreResult &&
													fetchMoreResult.followers &&
													fetchMoreResult.followers.length > 0
												)
											) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												followers: [...prev.followers, ...fetchMoreResult.followers]
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

export default Follower;
