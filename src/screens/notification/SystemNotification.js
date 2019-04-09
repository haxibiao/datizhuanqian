/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:38:51
 */

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView } from '../../components';
import { Theme, PxFit } from '../../utils';

import { Query, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { systemNotificationsQuery, userUnreadQuery } from '../../assets/graphql/notification.graphql';

import SystemNotificationItem from './components/SystemNotificationItem';

class SystemNotification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false
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
			<PageContainer title="系统通知" white>
				<Query
					query={systemNotificationsQuery}
					variables={{
						filter: ['WITHDRAW_SUCCESS', 'WITHDRAW_FAILURE', 'CURATION_REWARD', 'QUESTION_AUDIT']
					}}
					fetchPolicy="network-only"
				>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <ErrorView onPress={refetch} />;
						if (loading) return <LoadingSpinner />;
						if (!(data && data.notifications.length > 0)) return <EmptyView />;
						return (
							<FlatList
								style={{ backgroundColor: Theme.lightBorder }}
								data={data.notifications}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => (
									<SystemNotificationItem notification={item} navigation={navigation} />
								)}
								refreshControl={
									<RefreshControl
										refreshing={loading}
										onRefresh={refetch}
										colors={[Theme.primaryColor]}
									/>
								}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: data.notifications.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (!(fetchMoreResult && fetchMoreResult.notifications.length > 0)) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												notifications: [...prev.notifications, ...fetchMoreResult.notifications]
											});
										}
									});
								}}
								ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
							/>
						);
					}}
				</Query>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({});

export default connect(store => {
	return { user: store.users.user };
})(withApollo(SystemNotification));
