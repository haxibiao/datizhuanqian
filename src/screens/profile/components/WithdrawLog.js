/*
 * @Author: Gaoxuan
 * @Date:   2019-04-08 12:01:41
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { WithdrawsQuery } from '../../../assets/graphql/withdraws.graphql';

import WithdrawItem from '../../withdraws/components/WithdrawItem';

class WithdrawLog extends Component {
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
				<Query query={WithdrawsQuery} fetchPolicy="network-only">
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <ErrorView onPress={refetch} />;
						if (loading) return <LoadingSpinner />;
						if (!(data && data.withdraws))
							return <EmptyView imageSource={require('../../../assets/images/default_message.png')} />;
						return (
							<FlatList
								data={data.withdraws}
								keyExtractor={(item, index) => index.toString()}
								refreshControl={
									<RefreshControl
										refreshing={loading}
										onRefresh={refetch}
										colors={[Theme.primaryColor]}
									/>
								}
								renderItem={({ item, index }) => (
									<WithdrawItem
										item={item}
										navigation={navigation}
										style={{ paddingHorizontal: PxFit(Theme.itemSpace) }}
									/>
								)}
								ListHeaderComponent={this._userWithdrawInfo}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: data.withdraws.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (
												!(
													fetchMoreResult &&
													fetchMoreResult.withdraws &&
													fetchMoreResult.withdraws.length > 0
												)
											) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												withdraws: [...prev.withdraws, ...fetchMoreResult.withdraws]
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
})(WithdrawLog);
