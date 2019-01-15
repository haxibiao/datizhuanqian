import React, { Component } from 'react';
import { StyleSheet, View, Image, FlatList, Text, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';

import {
	DivisionLine,
	TabTop,
	BlankContent,
	Loading,
	LoadingError,
	LoadingMore,
	ContentEnd
} from '../../components/Universal';
import Screen from '../Screen';
import { Colors } from '../../constants';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { WithdrawsQuery } from '../../graphql/withdraws.graphql';
import { UserWithdrawQuery } from '../../graphql/user.graphql';
import { Query } from 'react-apollo';

const { width, height } = Dimensions.get('window');

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
			<Screen>
				<DivisionLine height={10} />
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
			<Query query={UserWithdrawQuery} variables={{ id: user.id }}>
				{({ data, error, loading, refetch, fetchMore }) => {
					if (error) return null;
					if (!(data && data.user)) return null;
					return (
						<View style={styles.top}>
							<DivisionLine height={10} />
							<View style={styles.topLeft}>
								<Text style={{ fontSize: 16 }}>剩余智慧点</Text>
								<Text style={{ fontSize: 16, fontWeight: '600' }}>{data.user.gold}</Text>
							</View>
							<View style={styles.topRight}>
								<Text style={{ fontSize: 16 }}>累计成功提现</Text>
								<Text style={{ fontSize: 16, fontWeight: '600' }}>
									￥{data.user.transaction_sum_amount}
								</Text>
							</View>
						</View>
					);
				}}
			</Query>
		);
	};

	_withdrawLogItem = ({ item, index }) => {
		const { navigation } = this.props;
		return (
			<View style={styles.item}>
				<View
					style={{
						width: ((width - 30) * 4) / 9
					}}
				>
					<Text style={{ fontSize: 15 }}>{item.created_at}</Text>
				</View>
				<View
					style={{
						width: (width - 30) / 9
					}}
				>
					<Text style={{ fontSize: 15 }}>￥{item.amount.toFixed(0)}</Text>
				</View>
				<View style={{ alignItems: 'flex-end', width: ((width - 30) * 4) / 9 }}>
					{item.status == -1 && (
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('提现详情', {
									withdraws: item
								});
							}}
						>
							<Text
								style={{
									color: Colors.red,
									fontSize: 15,
									textAlign: 'right'
								}}
							>
								提现失败(查看详情)
							</Text>
						</TouchableOpacity>
					)}
					{item.status == 1 && (
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('提现详情', {
									withdraws: item
								});
							}}
						>
							<Text
								style={{
									color: Colors.weixin,
									fontSize: 15,
									textAlign: 'right'
								}}
							>
								提现成功(查看详情)
							</Text>
						</TouchableOpacity>
					)}
					{item.status == 0 && (
						<Text
							style={{
								color: Colors.theme,
								fontSize: 15,
								textAlign: 'right'
							}}
						>
							待处理
						</Text>
					)}
				</View>
			</View>
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
		height: 50,
		borderRightWidth: 1,
		borderRightColor: '#969696'
	},
	topRight: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 50
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',

		paddingVertical: 15,
		borderTopColor: Colors.lightBorder,
		borderTopWidth: 1,
		paddingHorizontal: 15
	}
});

export default connect(store => {
	return {
		log: store.users.log
	};
})(WithdrawsLogScreen);
