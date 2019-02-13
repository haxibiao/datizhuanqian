import React, { Component } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { BlankContent, Loading, LoadingError, LoadingMore, ContentEnd, Screen } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import { Query } from 'react-apollo';
import { systemNotificationsQuery } from '../../graphql/notification.graphql';

import SystemNotificationItem from './SystemNotificationItem';

class SystemNotificationScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}

	render() {
		const { navigation } = this.props;
		return (
			<Screen>
				<Query
					query={systemNotificationsQuery}
					variables={{ filter: ['WITHDRAW_SUCCESS', 'WITHDRAW_FAILURE', 'QUESTION_REDRESS_REWARD'] }}
					fetchPolicy="network-only"
				>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <Loading />;
						if (!(data && data.notifications.length > 0))
							return <BlankContent text={'还没有通知哦'} fontSize={14} />;
						return (
							<FlatList
								style={{ backgroundColor: Colors.lightBorder }}
								data={data.notifications}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => (
									<SystemNotificationItem notification={item} navigation={navigation} />
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

export default SystemNotificationScreen;
