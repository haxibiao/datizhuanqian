/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Linking } from 'react-native';
import { PageContainer, Iconfont, TouchFeedback, Button, SubmitLoading, OverlayViewer, Row } from '../../components';

import { Theme, PxFit, SCREEN_WIDTH, WPercent, Tools } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Storage, ItemKeys } from '../../store/localStorage';

import { CreateWithdrawMutation, WithdrawsQuery } from '../../assets/graphql/withdraws.graphql';
import { UserQuery } from '../../assets/graphql/User.graphql';
import { Mutation, Query, compose, graphql } from 'react-apollo';

import RuleDescription from './components/RuleDescription';
import NotLogin from './components/NotLogin';
import WithdrawGuidance from './components/WithdrawGuidance';

const EXCHANGE_RATE = 600; //汇率

class index extends Component {
	constructor(props) {
		super(props);
		this.handleWithdraws = this.handleWithdraws.bind(this);
		this.state = {
			clickControl: false,
			isVisible: false,
			userCache: {
				gold: 0,
				wallet: {
					available_balance: 0
				}
			}
		};
	}

	componentDidMount() {
		this.loadCache();
	}

	async loadCache() {
		let userCache = await Storage.getItem(ItemKeys.userCache);
		if (userCache) {
			this.setState({
				userCache
			});
		}
	}

	//处理提现
	handleWithdraws(user, amount, wallet) {
		this.setState({
			clickControl: true
		});
		//判断提现次数
		if (user.available_withdraw_count < 1) {
			this.WithdrawsTipsModalVisible();
			this.setState({
				clickControl: false
			});
			Toast.show({ content: '今日提现次数已达上限~' });
		} else {
			this._checkBalance(user, amount, wallet);
		}
	}

	//检查余额
	_checkBalance(user, amount, wallet) {
		let { clickControl } = this.state;
		if (checkAmount(user, amount, wallet)) {
			this._withdrawsRequest(amount);
		} else {
			Toast.show({ content: '智慧点不足，快去答题赚钱吧~' });
			this.setState({
				clickControl: false
			});
		}
	}

	//发起提现请求
	async _withdrawsRequest(amount) {
		const user_id = this.props.user.id;
		let result = {};

		this.setState({
			isVisible: true
		});

		try {
			result = await this.props.CreateWithdrawMutation({
				variables: {
					amount: amount
				},
				refetchQueries: () => [
					{
						query: UserQuery,
						variables: { id: user_id }
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
				clickControl: false
			});
			this.setState({
				isVisible: false
			});
		} else {
			this.props.navigation.dispatch(
				Methods.navigationAction({ routeName: '提现申请', params: { amount: amount } })
			);
			this.setState({
				clickControl: false
			});
			this.setState({
				isVisible: false
			});
		}
	}

	showRule = () => {
		OverlayViewer.show(<RuleDescription />);
	};

	calcExchange(gold, value) {
		return gold / 600 > value;
	}

	render() {
		let { clickControl, isVisible, userCache } = this.state;
		const { user, login, navigation, luckyMoney } = this.props;
		return (
			<PageContainer
				title="提现"
				isTopNavigator
				rightView={
					<TouchFeedback onPress={this.showRule} style={styles.rule}>
						<Iconfont name={'question'} size={PxFit(19)} color={'#fff'} />
					</TouchFeedback>
				}
			>
				{login ? (
					<Query query={UserQuery} variables={{ id: user.id }}>
						{({ data, loading, error, refetch }) => {
							//点击刷新
							navigation.addListener('didFocus', payload => {
								refetch();
							});
							let user = Tools.syncGetter('user', data);
							if (!user) {
								user = userCache;
							}
							return (
								<View style={styles.container}>
									<View style={styles.header}>
										<View style={{ flex: 1 }}>
											<Text style={styles.type}>剩余智慧点</Text>
											<Text style={styles.gold}>{user.gold}</Text>
										</View>
										<View style={{ flex: 1 }}>
											<Text style={styles.type}>当前余额(元)</Text>
											<Text style={styles.gold}>
												{user.wallet && user.wallet.available_balance
													? `${user.wallet.available_balance}.00`
													: '0.00'}
											</Text>
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
														onPress={() => {
															this.handleWithdraws(user, luckyMoney.value, user.wallet);
														}}
														disabled={!bool || clickControl}
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
										{user.pay_account ? (
											<View style={styles.footer}>
												<Text style={styles.tips}>当前汇率：600智慧点=1元</Text>
												<Button
													title={'查看提现日志'}
													style={{
														height: PxFit(38),
														borderRadius: PxFit(5),
														backgroundColor: Theme.primaryColor,
														width: WPercent(80)
													}}
													onPress={() => navigation.navigate('WithdrawLog')}
												/>
											</View>
										) : (
											<WithdrawGuidance navigation={navigation} />
										)}
									</View>
								</View>
							);
						}}
					</Query>
				) : (
					<NotLogin navigation={navigation} />
				)}
				<SubmitLoading isVisible={isVisible} content={'加载中...'} />
			</PageContainer>
		);
	}
}

function checkAmount(user, amount, wallet) {
	let canWithdraw = user.gold / EXCHANGE_RATE >= amount || (wallet && wallet.available_balance >= amount);
	return canWithdraw;
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
		paddingVertical: PxFit(30)
	},
	type: {
		color: Theme.defaultTextColor,
		fontSize: PxFit(13),
		textAlign: 'center',
		marginBottom: PxFit(10)
	},
	gold: {
		color: Theme.secondaryColor,
		fontSize: PxFit(40),
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
		marginBottom: PxFit(Theme.itemSpace),
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
		color: Theme.subTextColor,
		paddingVertical: PxFit(10),
		lineHeight: PxFit(18)
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login,
		luckyMoney: store.withdraws.luckyMoney
	};
})(compose(graphql(CreateWithdrawMutation, { name: 'CreateWithdrawMutation' }))(index));
