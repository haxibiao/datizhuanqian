/*
 * @Author: Gaoxuan
 * @Date:   2019-05-05 16:02:48
 */

import React, { Component } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
	PageContainer,
	ListFooter,
	ErrorView,
	LoadingSpinner,
	EmptyView,
	CustomRefreshControl
} from '../../components';
import { Theme, PxFit } from '../../utils';

import { Query, withApollo, GQL } from 'apollo';
import { app } from 'store';

import LikeNotificationItem from './components/LikeNotificationItem';

class CommentNotification extends Component {
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
			<PageContainer title="赞" white>
				<Query query={GQL.likeNotificationsQuery} variables={{ filter: ['LIKED'] }} fetchPolicy="network-only">
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
									<LikeNotificationItem notification={item} navigation={navigation} />
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

export default withApollo(CommentNotification);
