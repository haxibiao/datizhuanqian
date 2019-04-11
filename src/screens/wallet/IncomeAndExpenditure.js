/*
 * @flow
 * created by wyk made in 2019-04-11 17:24:59
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView, Row } from '../../components';
import { Theme, PxFit, SCREEN_WIDTH, Tools } from '../../utils';

import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { GoldsQuery } from '../../assets/graphql/user.graphql';

import IncomeAndExpenditureItem from './components/IncomeAndExpenditureItem';

class IncomeAndExpenditure extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: true
		};
	}

	render() {
		const { user, navigation } = this.props;

		return (
			<Query query={GoldsQuery} fetchPolicy="network-only" variables={{ user_id: user.id }}>
				{({ data, error, loading, refetch, fetchMore }) => {
					let golds = Tools.syncGetter('golds', data);
					let empty = golds && golds.length === 0;
					loading = !golds;
					return (
						<PageContainer
							title="收支明细"
							refetch={refetch}
							error={error}
							loading={loading}
							empty={empty}
							EmptyView={<EmptyView imageSource={require('../../assets/images/default_message.png')} />}
						>
							<View style={styles.container}>
								<FlatList
									data={golds}
									keyExtractor={(item, index) => index.toString()}
									refreshControl={
										<RefreshControl
											refreshing={loading}
											onRefresh={refetch}
											colors={[Theme.primaryColor]}
										/>
									}
									renderItem={({ item, index }) => (
										<IncomeAndExpenditureItem item={item} navigation={navigation} />
									)}
									ListHeaderComponent={this._userWithdrawInfo}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										fetchMore({
											variables: {
												offset: golds.length
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
							</View>
						</PageContainer>
					);
				}}
			</Query>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(IncomeAndExpenditure);
