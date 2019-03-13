/*
 * @Author: Gaoxuan
 * @Date:   2019-03-12 09:55:49
 */

import React, { Component } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { BlankContent, Loading, LoadingError, LoadingMore, ContentEnd, Screen, DivisionLine } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import { Query, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { FansNotificationsQuery, userUnreadQuery } from '../../graphql/notification.graphql';

import FansNotification from './type/FansNotification';

class FansNotificationScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}

	componentWillUnmount() {
		const { client, user } = this.props;
		client.query({
			query: userUnreadQuery,
			variable: {
				id: user.id
			},
			fetchPolicy: 'network-only'
		});
	}

	render() {
		const { navigation } = this.props;
		return (
			<Screen>
				<DivisionLine height={5} />
				<Query
					query={FansNotificationsQuery}
					variables={{ filter: ['USER_FOLLOW'] }}
					fetchPolicy="network-only"
				>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <Loading />;
						if (!(data && data.notifications.length > 0))
							return <BlankContent text={'还没有通知哦'} fontSize={14} />;
						return (
							<FlatList
								data={data.notifications}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => (
									<FansNotification follow={item.follow} navigation={navigation} />
								)}
								refreshControl={
									<RefreshControl refreshing={loading} onRefresh={refetch} colors={[Colors.theme]} />
								}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									if (data.notifications) {
										fetchMore({
											variables: {
												offset: data.notifications.length
											},
											updateQuery: (prev, { fetchMoreResult }) => {
												if (!(fetchMoreResult && fetchMoreResult.notifications.length > 0)) {
													this.setState({
														fetchingMore: false
													});
													return prev;
												}
												return Object.assign({}, prev, {
													notifications: [
														...prev.notifications,
														...fetchMoreResult.notifications
													]
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
										<ContentEnd content={'没有更多记录了~'} />
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

export default connect(store => {
	return { user: store.users.user };
})(withApollo(FansNotificationScreen));
