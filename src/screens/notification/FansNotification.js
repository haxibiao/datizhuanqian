/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:39:24
 */

/*
 * @Author: Gaoxuan
 * @Date:   2019-03-12 09:55:49
 */

import React, { Component } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView, CustomRefreshControl } from 'components';
import { Theme, PxFit } from 'utils';

import { Query, withApollo, GQL } from 'apollo';
import { app } from 'store';

import FansNotificationItem from './components/FansNotificationItem';

class FansNotification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false
		};
	}

	componentWillUnmount() {
		const { client } = this.props;
		client.query({
			query: GQL.userUnreadQuery,
			variable: {
				id: app.me.id
			},
			fetchPolicy: 'network-only'
		});
	}

	render() {
		const { navigation } = this.props;
		return (
			<PageContainer title="粉丝" white>
				<Query
					query={GQL.FansNotificationsQuery}
					variables={{ filter: ['USER_FOLLOW'] }}
					fetchPolicy="network-only"
				>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <ErrorView onPress={refetch} />;
						if (loading) return <LoadingSpinner />;
						if (!(data && data.notifications.length > 0)) return <EmptyView />;
						return (
							<FlatList
								data={data.notifications}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => (
									<FansNotificationItem follow={item.follow} navigation={navigation} />
								)}
								refreshControl={
									<CustomRefreshControl
										refreshing={loading}
										onRefresh={refetch}
										reset={() =>
											this.setState({
												finished: false
											})
										}
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

export default withApollo(FansNotification);
