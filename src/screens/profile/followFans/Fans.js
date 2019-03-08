/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 15:01:30
 */

/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 15:26:14
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import {
	Screen,
	DivisionLine,
	LoadingMore,
	ContentEnd,
	UserItem,
	LoadingError,
	Loading,
	BlankContent
} from '../../../components';
import { Colors, Divice } from '../../../constants';

import { Query } from 'react-apollo';
import { FollowersQuery } from '../../../graphql/user.graphql';

class Fans extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation } = this.props;
		return (
			<Screen tabLabel="粉丝" header>
				<DivisionLine height={5} />
				<Query query={FollowersQuery} variables={{ filter: 'users' }}>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <Loading />;
						if (!(data && data.followers.length > 0))
							return <BlankContent text={'还没有粉丝哦'} fontSize={14} />;
						return (
							<FlatList
								data={data.followers}
								keyExtractor={(item, index) => index.toString()}
								refreshControl={
									<RefreshControl refreshing={loading} onRefresh={refetch} colors={[Colors.theme]} />
								}
								renderItem={({ item, index }) => (
									<UserItem navigation={navigation} user={item.follow_user} />
								)}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									if (data.followers) {
										fetchMore({
											variables: {
												offset: data.followers.length
											},
											updateQuery: (prev, { fetchMoreResult }) => {
												if (
													!(
														fetchMoreResult &&
														fetchMoreResult.followers &&
														fetchMoreResult.followers.length > 0
													)
												) {
													this.setState({
														fetchingMore: false
													});
													return prev;
												}
												return Object.assign({}, prev, {
													followers: [...prev.followers, ...fetchMoreResult.followers]
												});
											}
										});
									} else {
										this.setState({
											fetchingMore: false
										});
									}
								}}
								ListFooterComponent={() => {
									return this.state.fetchingMore ? (
										<LoadingMore />
									) : (
										<ContentEnd content={'没有更多了~'} />
									);
								}}
							/>
						);
					}}
				</Query>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({});

export default Fans;
