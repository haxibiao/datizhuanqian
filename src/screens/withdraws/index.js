/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Linking } from 'react-native';
import { PageContainer, Iconfont, TouchFeedback, Button, SubmitLoading, OverlayViewer } from '../../components';

import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { CreateWithdrawMutation, WithdrawsQuery } from '../../assets/graphql/withdraws.graphql';
import { UserQuery } from '../../assets/graphql/User.graphql';
import { Mutation, Query, compose, graphql } from 'react-apollo';

import RuleDescription from './components/RuleDescription';
import NotLogin from './components/NotLogin';

const EXCHANGE_RATE = 600; //汇率

class index extends Component {
	constructor(props) {
		super(props);
		this.handleWithdraws = this.handleWithdraws.bind(this);
		this.state = {
			clickControl: false,
			isVisible: false
		};
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

	render() {
		let { clickControl, isVisible } = this.state;
		const { user, login, navigation, luckyMoney } = this.props;
		return (
			<PageContainer
				title="提现"
				isTopNavigator
				rightView={
					<TouchFeedback onPress={this.showRule} style={{ padding: PxFit(5) }}>
						<Iconfont name={'question'} size={18} color={'#fff'} />
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

							if (error) return <UserWithdrawsCache luckyMoney={luckyMoney} />;
							if (!(data && data.user)) return null;

							return (
								<View style={styles.container}>
									<View style={styles.header}>
										<View style={{ width: SCREEN_WIDTH / 2 }}>
											<Text style={styles.gold}>{data.user.gold}</Text>
											<Text style={styles.type}>智慧点</Text>
										</View>
										<View style={{ width: SCREEN_WIDTH / 2 }}>
											<Text style={styles.gold}>
												{data.user.wallet && data.user.wallet.available_balance
													? `${data.user.wallet.available_balance}.00`
													: '0.00'}
											</Text>
											<Text style={styles.type}>余额（元）</Text>
										</View>
									</View>

									<View style={styles.main}>
										<View style={styles.center}>
											{luckyMoney.map((luckyMoney, index) => {
												return (
													<TouchFeedback
														style={styles.item}
														onPress={() => {
															this.handleWithdraws(
																data.user,
																luckyMoney.value,
																data.user.wallet
															);
														}}
														disabled={clickControl}
														key={index}
													>
														<Text style={styles.content}>
															提现
															<Text style={{ color: Theme.themeRed }}>
																{luckyMoney.value}元
															</Text>
														</Text>
													</TouchFeedback>
												);
											})}
										</View>
										{user.pay_account && (
											<View style={styles.footer}>
												<Text style={styles.tips}>当前汇率：600智慧点=1元</Text>
												<Button
													title={'查看提现日志'}
													style={{
														height: PxFit(38),
														borderRadius: PxFit(19),
														backgroundColor: Theme.theme,
														width: SCREEN_WIDTH - PxFit(80)
													}}
													onPress={() => navigation.navigate('WithdrawLog')}
												/>
											</View>
										)}
									</View>
									{user.pay_account ? null : (
										<WithdrawsTips navigation={navigation} isVisible={isVisible} />
									)}
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
		backgroundColor: '#FFFEFC'
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: PxFit(20),
		paddingBottom: PxFit(30),
		borderBottomWidth: PxFit(10),
		borderBottomColor: '#F0F0F0'
	},
	gold: {
		color: Theme.themeRed,
		fontSize: PxFit(44),
		paddingBottom: PxFit(2),
		textAlign: 'center'
	},
	type: {
		color: Theme.grey,
		fontSize: PxFit(13),
		textAlign: 'center'
	},
	main: {
		justifyContent: 'space-between',
		flex: 1
	},
	center: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: PxFit(15),
		justifyContent: 'space-between'
	},
	item: {
		paddingVertical: 25,
		width: (SCREEN_WIDTH - PxFit(44)) / 2,
		borderColor: '#E0E0E0',
		borderWidth: PxFit(0.5),
		alignItems: 'center',
		marginTop: PxFit(20),
		borderRadius: PxFit(5)
	},
	content: {
		fontSize: 16,
		color: Theme.black
	},
	footer: {
		alignItems: 'center',
		paddingBottom: PxFit(30)
	},
	tips: {
		fontSize: PxFit(15),
		color: '#363636',
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
