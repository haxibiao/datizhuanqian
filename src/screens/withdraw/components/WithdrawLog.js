/*
 * @Author: Gaoxuan
 * @Date:   2019-04-08 12:01:41
 */

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { PageContainer, ListFooter, ErrorView, LoadingSpinner, EmptyView, CustomRefreshControl } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, Tools } from 'utils';
import { Query, GQL } from 'apollo';

import WithdrawLogItem from './WithdrawLogItem';

class WithdrawLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			finished: false
		};
	}

	render() {
		const { navigation } = this.props;

		return (
			<View style={{ flex: 1 }}>
				<Query query={GQL.WithdrawsQuery} fetchPolicy="network-only">
					{({ data, error, loading, refetch, fetchMore }) => {
						let withdraws = Tools.syncGetter('withdraws', data);
						if (error) return <ErrorView onPress={refetch} error={error} />;
						if (loading) return <LoadingSpinner />;
						if (!withdraws || withdraws.length === 0)
							return <EmptyView imageSource={require('../../../assets/images/default_message.png')} />;
						return (
							<FlatList
								data={withdraws}
								keyExtractor={(item, index) => index.toString()}
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
								renderItem={({ item, index }) => (
									<WithdrawLogItem item={item} navigation={navigation} />
								)}
								ListHeaderComponent={this._userWithdrawInfo}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									fetchMore({
										variables: {
											offset: withdraws.length
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

// class WithdrawLogItem extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {};
// 	}
// 	render() {
// 		const { navigation, item } = this.props;
// 		return (
// 			<TouchableOpacity
// 				style={styles.item}
// 				activeOpacity={0.7}
// 				onPress={() => {
// 					item.status == 0
// 						? null
// 						: navigation.navigate('withdrawLogDetails', {
// 								withdraw_id: item.id
// 						  });
// 				}}
// 			>
// 				<View>
// 					{item.status == -1 && <Text style={{ fontSize: 15, color: Theme.themeRed }}>提现失败</Text>}
// 					{item.status == 1 && <Text style={{ fontSize: 15, color: Theme.weixin }}>提现成功</Text>}
// 					{item.status == 0 && <Text style={{ fontSize: 15, color: Theme.theme }}>待处理</Text>}
// 					<Text style={{ fontSize: 12, color: Theme.grey, paddingTop: 10 }}>{item.created_at}</Text>
// 				</View>
// 				<View>
// 					<Text style={{ fontSize: 20, color: Theme.black }}>￥{item.amount.toFixed(0)}.00</Text>
// 				</View>
// 			</TouchableOpacity>
// 		);
// 	}
// }
const styles = StyleSheet.create({
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		borderBottomColor: Theme.lightBorder,
		borderBottomWidth: 0.5,
		paddingHorizontal: 15
	}
});

export default WithdrawLog;
