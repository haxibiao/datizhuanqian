import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, RefreshControl } from 'react-native';
import {
	Header,
	BlankContent,
	Loading,
	LoadingError,
	LoadingMore,
	ContentEnd,
	Iconfont,
	Screen
} from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { notificationsQuery } from '../../graphql/notification.graphql';

import NotificationType from './NotificationType';
class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}

	render() {
		let { navigation } = this.props;
		return (
			<Screen>
				<Query query={notificationsQuery}>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <Loading />;
						if (!(data && !data.notifications == []))
							return <BlankContent text={'还没有通知哦'} fontSize={14} />;
						return (
							<FlatList
								style={{ backgroundColor: Colors.lightBorder }}
								data={data.notifications}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => (
									<NotificationType notification={item} navigation={navigation} />
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBorder
	}
});

export default connect(store => {
	return { user: store.users.user };
})(HomeScreen);
