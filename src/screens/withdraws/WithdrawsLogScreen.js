import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, RefreshControl } from 'react-native';
import {
	DivisionLine,
	BlankContent,
	Loading,
	LoadingError,
	LoadingMore,
	ContentEnd,
	Screen,
	WithdrawsLogItem
} from '../../components';
import { Colors } from '../../constants';

import { connect } from 'react-redux';
import { WithdrawsQuery } from '../../graphql/withdraws.graphql';
import { UserWithdrawQuery } from '../../graphql/user.graphql';
import { Query } from 'react-apollo';

class WithdrawsLogScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true
		};
	}

	render() {
		const { log, navigation } = this.props;
		const { user } = navigation.state.params;
		return (
			<Screen customStyle={{ borderBottomColor: Colors.lightBorder, borderBottomWidth: 1 }}>
				<Query query={WithdrawsQuery} fetchPolicy="network-only">
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <Loading />;
						if (!(data && data.withdraws))
							return <BlankContent text={'暂无提现记录哦,快去赚取智慧点吧~'} fontSize={14} />;
						return (
							<FlatList
								data={data.withdraws}
								keyExtractor={(item, index) => index.toString()}
								refreshControl={
									<RefreshControl refreshing={loading} onRefresh={refetch} colors={[Colors.theme]} />
								}
								renderItem={this._withdrawLogItem}
								renderItem={({ item, index }) => (
									<WithdrawsLogItem item={item} navigation={navigation} />
								)}
								ListHeaderComponent={this._userWithdrawInfo}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									if (data.withdraws) {
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
														fetchingMore: false
													});
													return prev;
												}
												return Object.assign({}, prev, {
													withdraws: [...prev.withdraws, ...fetchMoreResult.withdraws]
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

	_userWithdrawInfo = () => {
		const { navigation } = this.props;
		const { user } = navigation.state.params;
		return (
			<Query query={UserWithdrawQuery} variables={{ id: user.id }} fetchPolicy="network-only">
				{({ data, error, loading, refetch, fetchMore }) => {
					if (error) return null;
					if (!(data && data.user)) return null;
					return (
						<View>
							<View style={styles.top}>
								<View style={styles.topLeft}>
									<Text style={{ fontSize: 14, color: Colors.grey }}>智慧点</Text>
									<Text style={{ fontSize: 24, color: Colors.themeRed }}>{data.user.gold}</Text>
								</View>
								<View style={styles.topRight}>
									<Text style={{ fontSize: 14, color: Colors.grey }}>累计收益(元)</Text>
									<Text style={{ fontSize: 24, color: Colors.themeRed }}>
										{data.user.transaction_sum_amount}.00
									</Text>
								</View>
							</View>
							<DivisionLine height={10} />
						</View>
					);
				}}
			</Query>
		);
	};

	_withdrawLogItem = ({ item, index }) => {
		const { navigation } = this.props;
		return (
			<TouchableOpacity
				style={styles.item}
				activeOpacity={0.7}
				onPress={() => {
					item.status == 0
						? null
						: navigation.navigate('提现详情', {
								withdraws: item
						  });
				}}
			>
				<View>
					{item.status == -1 && <Text style={{ fontSize: 18, color: Colors.themeRed }}>提现失败</Text>}
					{item.status == 1 && <Text style={{ fontSize: 18, color: Colors.weixin }}>提现成功</Text>}
					{item.status == 0 && <Text style={{ fontSize: 18, color: Colors.theme }}>待处理</Text>}
					<Text style={{ fontSize: 15, color: Colors.grey, paddingTop: 10 }}>{item.created_at}</Text>
				</View>
				<View>
					<Text style={{ fontSize: 26, color: item.status == 1 ? Colors.weixin : Colors.black }}>
						￥{item.amount.toFixed(0)}.00
					</Text>
				</View>
			</TouchableOpacity>
		);
	};
}

const styles = StyleSheet.create({
	top: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 20
	},
	topLeft: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRightWidth: 1,
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
		paddingVertical: 15,
		borderBottomColor: Colors.lightBorder,
		borderBottomWidth: 1,
		paddingHorizontal: 15
	}
});

export default connect(store => {
	return {
		log: store.users.log
	};
})(WithdrawsLogScreen);
