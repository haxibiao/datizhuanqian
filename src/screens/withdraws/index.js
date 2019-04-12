/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Linking, ScrollView, FlatList } from 'react-native';

import { PageContainer, Iconfont, TouchFeedback, SubmitLoading, Loader, Row, EmptyView } from '../../components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, WPercent, Tools } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Storage, ItemKeys } from '../../store/localStorage';

import { CreateWithdrawMutation, WithdrawsQuery } from '../../assets/graphql/withdraws.graphql';
import { UserQuery } from '../../assets/graphql/User.graphql';
import { Mutation, Query, compose, graphql } from 'react-apollo';

import { Overlay } from 'teaset';
import WithdrawGuidance from './components/WithdrawGuidance';
import WithdrawItem from './components/WithdrawItem';

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			finished: false
		};
	}

	//处理提现
	handleWithdraws = (user, amount) => {
		let fn = () => {
			if (user.available_withdraw_count < 1) {
				this.WithdrawsTipsModalVisible();
				Toast.show({ content: '今日提现次数已达上限~' });
			} else {
				this._withdrawsRequest(amount);
			}
		};
		return Tools.throttle(fn, 400);
	};

	//发起提现请求
	async _withdrawsRequest(amount) {
		let result = {};
		this.setState({
			isVisible: true
		});
		try {
			result = await this.props.CreateWithdrawMutation({
				variables: {
					amount
				},
				refetchQueries: () => [
					{
						query: UserQuery,
						variables: { id: this.props.user.id }
					},
					{
						query: WithdrawsQuery
					}
				]
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str });
			this.setState({
				isVisible: false
			});
		} else {
			this.props.navigation.navigate('WithdrawApply', { amount });
			this.setState({
				isVisible: false
			});
		}
	}

	calcExchange(userGold, value) {
		return userGold / 600 > value;
	}

	withdrawsFetchMore = () => {
		return this.withdrawsLogfetchMore({
			variables: {
				offset: this.withdrawsLogOffset
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!(fetchMoreResult && fetchMoreResult.withdraws && fetchMoreResult.withdraws.length > 0)) {
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
	};

	renderWithDrawsLog() {
		let { navigation } = this.props;
		return (
			<Query query={WithdrawsQuery} fetchPolicy="network-only">
				{({ data, error, loading, refetch, fetchMore }) => {
					let withdrawsLog = Tools.syncGetter('withdraws', data) || [];
					this.withdrawsLogfetchMore = fetchMore;
					this.withdrawsLogOffset = withdrawsLog.length;
					return (
						<View>
							<FlatList
								bounces={false}
								scrollEnabled={false}
								data={withdrawsLog}
								keyExtractor={(item, index) => index.toString()}
								renderItem={({ item, index }) => <WithdrawItem item={item} navigation={navigation} />}
								ListEmptyComponent={
									<EmptyView imageSource={require('../../assets/images/default_message.png')} />
								}
							/>
							<Loader
								hidden={withdrawsLog.length === 0}
								finished={withdrawsLog.length < 10 || this.state.finished}
								onLoad={this.withdrawsFetchMore}
							/>
						</View>
					);
				}}
			</Query>
		);
	}

	render() {
		let { clickControl, isVisible, userCache } = this.state;
		let { user, login, navigation, luckyMoney, exchangeRate, UserQuery } = this.props;
		user = Tools.syncGetter('user', UserQuery) || user;
		return (
			<PageContainer title="提现" didFocus={UserQuery && UserQuery.refetch} white>
				<View style={styles.container}>
					<View style={styles.header}>
						<View style={{ flex: 1 }}>
							<Text style={styles.greyText}>当前智慧点</Text>
							<Text style={styles.goldText}>{user.gold}</Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={styles.greyText}>当前汇率(智慧点/RMB)</Text>
							<Text style={styles.goldText}>{exchangeRate}/1</Text>
						</View>
					</View>
					<View style={styles.withdraws}>
						<View style={styles.center}>
							{luckyMoney.map((luckyMoney, index) => {
								let bool = this.calcExchange(user.gold, luckyMoney.value);
								return (
									<TouchFeedback
										style={[
											styles.withdrawItem,
											bool && {
												backgroundColor: Theme.primaryColor
											}
										]}
										onPress={this.handleWithdraws(user, luckyMoney.value)}
										disabled={!bool}
										key={index}
									>
										<Text
											style={[
												styles.content,
												bool && {
													color: '#fff'
												}
											]}
										>
											提现
											{luckyMoney.value}元
										</Text>
									</TouchFeedback>
								);
							})}
						</View>
						<View style={styles.withdrawsLogTitleWrap}>
							<Text style={styles.withdrawsLogTitle}>提现记录</Text>
						</View>
						<ScrollView
							contentContainerStyle={{ flexGrow: 1, paddingHorizontal: PxFit(Theme.itemSpace) }}
							keyboardShouldPersistTaps="always"
							showsVerticalScrollIndicator={false}
							bounces={false}
						>
							{user.pay_account ? (
								this.renderWithDrawsLog()
							) : (
								<WithdrawGuidance navigation={navigation} />
							)}
						</ScrollView>
					</View>
				</View>
				<SubmitLoading isVisible={isVisible} content={'请稍后...'} />
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	rule: {
		flex: 1,
		justifyContent: 'center'
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: PxFit(20),
		marginBottom: PxFit(10)
	},
	greyText: {
		color: Theme.subTextColor,
		fontSize: PxFit(13),
		textAlign: 'center',
		marginBottom: PxFit(8)
	},
	goldText: {
		color: Theme.primaryColor,
		fontSize: PxFit(20),
		textAlign: 'center'
	},
	withdraws: {
		justifyContent: 'space-between',
		flex: 1
	},
	center: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: PxFit(Theme.itemSpace),
		justifyContent: 'space-between'
	},
	withdrawItem: {
		marginTop: PxFit(10),
		width: (SCREEN_WIDTH - PxFit(Theme.itemSpace * 3)) / 2,
		height: PxFit(60),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: PxFit(5),
		backgroundColor: '#f5f5f5'
	},
	content: {
		fontSize: PxFit(16),
		color: Theme.subTextColor
	},
	footer: {
		alignItems: 'center',
		paddingBottom: PxFit(30)
	},
	tips: {
		fontSize: PxFit(15),
		color: Theme.secondaryColor,
		paddingVertical: PxFit(10),
		lineHeight: PxFit(18)
	},
	withdrawsLogTitleWrap: {
		marginHorizontal: PxFit(Theme.itemSpace),
		paddingVertical: PxFit(Theme.itemSpace),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	withdrawsLogTitle: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor
	}
});

export default compose(
	connect(store => ({
		user: store.users.user,
		login: store.users.login,
		luckyMoney: store.withdraws.luckyMoney,
		exchangeRate: store.app.exchangeRate
	})),
	graphql(UserQuery, {
		options: props => ({ variables: { id: props.user.id } }),
		name: 'UserQuery'
	}),
	graphql(CreateWithdrawMutation, { name: 'CreateWithdrawMutation' })
)(index);
