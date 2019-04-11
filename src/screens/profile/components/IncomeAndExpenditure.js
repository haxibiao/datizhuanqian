/*
 * @flow
 * created by wyk made in 2019-04-11 17:14:30
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import {
	PageContainer,
	ListFooter,
	ErrorView,
	LoadingSpinner,
	EmptyView,
	Row,
	CustomRefreshControl
} from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { GoldsQuery } from '../../../assets/graphql/user.graphql';

import IncomeAndExpenditureItem from '../../wallet/components/IncomeAndExpenditureItem';

class IntegralDetail extends Component {
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
				<Query query={GoldsQuery} fetchPolicy="network-only" variables={{ user_id: user.id }}>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <ErrorView onPress={refetch} />;
						if (loading) return <LoadingSpinner />;
						if (!(data && data.golds))
							return <EmptyView imageSource={require('../../../assets/images/default_message.png')} />;
						return (
							<FlatList
								data={data.golds}
								keyExtractor={(item, index) => index.toString()}
								refreshControl={<CustomRefreshControl onRefresh={refetch} />}
								renderItem={({ item, index }) => (
									<IncomeAndExpenditureItem item={item} navigation={navigation} />
								)}
								ListHeaderComponent={this._userWithdrawInfo}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: data.golds.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (
												!(
													fetchMoreResult &&
													fetchMoreResult.golds &&
													fetchMoreResult.golds.length > 0
												)
											) {
												this.setState({
													finished: true
												});
												return prev;
											}
											return Object.assign({}, prev, {
												golds: [...prev.golds, ...fetchMoreResult.golds]
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
})(IntegralDetail);
