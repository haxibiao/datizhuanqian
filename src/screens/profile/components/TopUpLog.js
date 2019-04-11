/*
 * @flow
 * created by wyk made in 2019-04-11 18:02:51
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { ExchangesQuery } from '../../../assets/graphql/user.graphql';

import TopUpItem from '../../wallet/components/TopUpItem';

class TopUpLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: true
		};
	}

	render() {
		const { user, navigation } = this.props;

		return (
			<View style={{ flex: 1 }}>
				<Query query={ExchangesQuery} fetchPolicy="network-only">
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <ErrorView onPress={refetch} />;
						if (loading) return <LoadingSpinner />;
						if (!(data && data.exchanges.length > 0))
							return <EmptyView imageSource={require('../../../assets/images/default_message.png')} />;
						return (
							<FlatList
								data={data.exchanges}
								keyExtractor={(item, index) => index.toString()}
								refreshControl={
									<RefreshControl
										refreshing={loading}
										onRefresh={refetch}
										colors={[Theme.primaryColor]}
									/>
								}
								renderItem={({ item, index }) => <TopUpItem item={item} navigation={navigation} />}
								ListHeaderComponent={this._userWithdrawInfo}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: data.exchanges.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (
												!(
													fetchMoreResult &&
													fetchMoreResult.exchanges &&
													fetchMoreResult.exchanges.length > 0
												)
											) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												exchanges: [...prev.exchanges, ...fetchMoreResult.exchanges]
											});
										}
									});
								}}
								ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
							/>
						);
					}}
				</Query>
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default connect(store => {
	return {
		user: store.users.user
	};
})(TopUpLog);
