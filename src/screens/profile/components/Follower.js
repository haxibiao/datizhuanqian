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
} from 'components';
import { Theme, PxFit, SCREEN_WIDTH, Tools } from 'utils';
import { Query, GQL } from 'apollo';

class Follower extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false
		};
	}

	render() {
		let { navigation } = this.props;
		return (
			<Query query={GQL.FollowersQuery} variables={{ filter: 'users' }} fetchPolicy="network-only">
				{({ loading, error, data, refetch, fetchMore }) => {
					let followers = Tools.syncGetter('followers', data);
					let empty = followers && followers.length === 0;
					loading = !followers;
					return (
						<PageContainer
							hiddenNavBar
							refetch={refetch}
							error={error}
							loading={loading}
							empty={empty}
							loadingSpinner={<Placeholder quantity={10} type="list" />}
						>
							<FlatList
								data={followers}
								keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
								refreshControl={
									<CustomRefreshControl
										onRefresh={refetch}
										reset={() => this.setState({ finished: false })}
									/>
								}
								renderItem={({ item, index }) => <UserItem navigation={navigation} user={item.user} />}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
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
