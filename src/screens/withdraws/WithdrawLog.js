/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:58:04
 */

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView } from '../../components';
import { Theme, PxFit } from '../../utils';

import { connect } from 'react-redux';
import { WithdrawsQuery } from '../../assets/graphql/withdraws.graphql';
import { UserWithdrawQuery } from '../../assets/graphql/user.graphql';
import { Query } from 'react-apollo';

import WithdrawLogItem from './components/WithdrawLogItem';

class WithdrawsLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false
		};
	}

	render() {
		const { user, navigation } = this.props;

		return (
			<PageContainer title="提现记录" white>
				<Query query={WithdrawsQuery} fetchPolicy="network-only">
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <ErrorView onPress={() => refetch()} />;
						if (loading) return <LoadingSpinner />;
						if (!(data && data.withdraws)) return <EmptyView />;

						return (
							<FlatList
								data={data.withdraws}
								keyExtractor={(item, index) => index.toString()}
								refreshControl={
									<RefreshControl refreshing={loading} onRefresh={refetch} colors={[Theme.theme]} />
								}
								renderItem={({ item, index }) => (
									<WithdrawLogItem item={item} navigation={navigation} />
								)}
								ListHeaderComponent={this._userWithdrawInfo}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: data.withdraws.length
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											console.log('fetchMoreResult', fetchMoreResult, fetchMoreResult.withdraws);
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
			</PageContainer>
		);
	}

	_userWithdrawInfo = () => {
		const { navigation, user } = this.props;
		return (
			<Query query={UserWithdrawQuery} variables={{ id: user.id }} fetchPolicy="network-only">
				{({ data, error, loading, refetch, fetchMore }) => {
					if (error) return null;
					if (!(data && data.user)) return null;
					return (
						<View>
							<View style={styles.top}>
								<View style={styles.topLeft}>
									<Text style={{ fontSize: PxFit(14), color: Theme.grey }}>智慧点</Text>
									<Text style={{ fontSize: PxFit(24), color: Theme.themeRed }}>{data.user.gold}</Text>
								</View>
								<View style={styles.topRight}>
									<Text style={{ fontSize: PxFit(14), color: Theme.grey }}>累计收益(元)</Text>
									<Text style={{ fontSize: PxFit(24), color: Theme.themeRed }}>
										{data.user.transaction_sum_amount}.00
									</Text>
								</View>
							</View>
						</View>
					);
				}}
			</Query>
		);
	};
}

const styles = StyleSheet.create({
	top: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: PxFit(20),
		borderBottomWidth: PxFit(10),
		borderBottomColor: Theme.lightBorder
	},
	topLeft: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRightWidth: PxFit(1),
		borderRightColor: '#969696'
	},
	topRight: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: PxFit(15),
		borderBottomColor: Theme.lightBorder,
		borderBottomWidth: PxFit(1),
		paddingHorizontal: PxFit(15)
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(WithdrawsLog);
