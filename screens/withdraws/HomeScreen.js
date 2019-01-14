import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Slider, TextInput, Dimensions, Image, Linking } from 'react-native';
import { Header } from '../../components/Header';
import { DivisionLine, TabTop, Banner, LoadingError, BlankContent, WithdrawsTips } from '../../components/Universal';
import { CheckUpdateModal, RuleDescriptionModal, WithdrawsTipsModal } from '../../components/Modal';
import { Button } from '../../components/Control';
import { Iconfont } from '../../utils/Fonts';

import Screen from '../Screen';
import NotLogin from './NotLogin';
import { Colors, Methods } from '../../constants';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { CreateWithdrawMutation, WithdrawsQuery } from '../../graphql/withdraws.graphql';

import { UserQuery } from '../../graphql/User.graphql';
import { Mutation, Query, compose, graphql } from 'react-apollo';

import codePush from 'react-native-code-push';

const { width, height } = Dimensions.get('window');

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.handlePromotModalVisible = this.handlePromotModalVisible.bind(this);
		this.RuleDescriptionModalVisible = this.RuleDescriptionModalVisible.bind(this);
		this.WithdrawsTipsModalVisible = this.WithdrawsTipsModalVisible.bind(this);
		this._withdraws = this._withdraws.bind(this);
		this.state = {
			value: 0,
			promotModalVisible: false,
			RuleDescriptioVisible: false,
			WithdrawsTipsVisible: false,
			exchangeRate: 600, //汇率
			clickControl: false,
			withdrawTips: '智慧点不足，快去答题赚钱吧~'
		};
		this.jump = false;
	}

	//点击提现
	_withdraws(user, amount, wallet) {
		console.log('with amount ', amount);
		this.setState({
			clickControl: true
		});
		//判断提现次数
		if (user.available_withdraw_count < 1) {
			this.WithdrawsTipsModalVisible();
			this.setState({
				clickControl: false,
				withdrawTips: '今日提现次数已达上限~'
			});
		} else {
			this._judgeBalance(user, amount, wallet);
		}
	}

	//判断余额
	_judgeBalance(user, amount, wallet) {
		let { exchangeRate, clickControl } = this.state;
		if (!(user.gold / exchangeRate > amount || (wallet && wallet.available_balance > amount))) {
			this.WithdrawsTipsModalVisible();
			this.setState({
				clickControl: false
			});
		} else {
			this._withdrawsRequest(amount);
		}
	}

	//提现请求
	async _withdrawsRequest(amount) {
		const user_id = this.props.user.id;

		let result = {};
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
			let info = result.errors.toString().indexOf('Cannot');
			if (info > -1) {
				codePush.checkForUpdate().then(update => {
					if (!update) {
						Methods.toast('请重启APP完成更新', -100);
					} else {
						codePush.sync({
							updateDialog: {
								// mandatoryContinueButtonLabel: "更新",
								// mandatoryUpdateMessage: "有新版本了，请您及时更新",
								optionalIgnoreButtonLabel: '取消',
								optionalInstallButtonLabel: '后台更新',
								optionalUpdateMessage: '发现新版本',
								title: '更新提示'
							},
							installMode: codePush.InstallMode.IMMEDIATE
						});
					}
				});
				//过渡办法
			} else {
				let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
				Methods.toast(str, -100); //打印错误信息
			}
			this.setState({
				clickControl: false
			});
		} else {
			this.props.navigation.navigate('提现申请', {
				amount: amount
			});
			this.setState({
				clickControl: false
			});

			// Methods.toast('发起提现成功,客服人员会尽快处理您的提现请求。', -100);
		}
	}

	render() {
		const {
			value,
			promotModalVisible,
			exchangeRate,
			RuleDescriptioVisible,
			WithdrawsTipsVisible,
			clickControl
		} = this.state;
		const { user, login, navigation } = this.props;

		return (
			<Screen header>
				<View style={styles.container}>
					<Header
						leftComponent={<Text />}
						customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
						rightComponent={
							<TouchableOpacity
								onPress={() => {
									this.RuleDescriptionModalVisible();
								}}
								style={{ padding: 5 }}
							>
								<Iconfont name={'question'} size={18} />
							</TouchableOpacity>
						}
					/>
					{login ? (
						<Query query={UserQuery} variables={{ id: user.id }} fetchPolicy="network-only">
							{({ data, loading, error, refetch }) => {
								if (error) return <LoadingError reload={() => refetch()} />;
								if (!(data && data.user)) return <BlankContent />;
								return (
									<View style={styles.container}>
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-between',
												paddingTop: 20,
												paddingBottom: 30
											}}
										>
											<View style={{ width: width / 2 }}>
												<Text style={styles.gold}>{data.user.gold}</Text>
												<Text style={styles.type}>智慧点</Text>
											</View>
											<View style={{ width: width / 2 }}>
												<Text style={styles.gold}>
													{data.user.wallet && data.user.wallet.available_balance
														? `${data.user.wallet.available_balance}.00`
														: '0.00'}
												</Text>

												<Text style={styles.type}>余额（元）</Text>
											</View>
										</View>

										<DivisionLine height={10} />
										<View style={{ justifyContent: 'space-between', flex: 1 }}>
											<View style={styles.center}>
												<TouchableOpacity
													style={styles.item}
													onPress={() => {
														this._withdraws(data.user, 1, data.user.wallet);
													}}
													disabled={clickControl}
												>
													<Text style={styles.content}>
														提现<Text style={{ color: Colors.themeRed }}>1元</Text>
													</Text>
												</TouchableOpacity>
												<TouchableOpacity
													style={styles.item}
													onPress={() => {
														this._withdraws(data.user, 3, data.user.wallet);
													}}
													disabled={clickControl}
												>
													<Text style={styles.content}>
														提现<Text style={{ color: Colors.themeRed }}>3元</Text>
													</Text>
												</TouchableOpacity>
												<TouchableOpacity
													style={styles.item}
													onPress={() => {
														this._withdraws(data.user, 5, data.user.wallet);
													}}
													disabled={clickControl}
												>
													<Text style={styles.content}>
														提现<Text style={{ color: Colors.themeRed }}>5元</Text>
													</Text>
												</TouchableOpacity>
												<TouchableOpacity
													style={styles.item}
													onPress={() => {
														this._withdraws(data.user, 10, data.user.wallet);
													}}
													disabled={clickControl}
												>
													<Text style={styles.content}>
														提现<Text style={{ color: Colors.themeRed }}>10元</Text>
													</Text>
												</TouchableOpacity>
											</View>
											{user.pay_account && (
												<View style={styles.footer}>
													<Text style={styles.tips}>当前汇率：600智慧点=1元</Text>
													<Button
														name={'查看提现日志'}
														style={{
															height: 38,
															borderRadius: 19,
															width: width - 80
														}}
														handler={() =>
															navigation.navigate('提现日志', {
																user: user
															})
														}
														theme={Colors.theme}
														fontSize={14}
													/>
												</View>
											)}
										</View>

										{
											// <CheckUpdateModal
											// 	visible={promotModalVisible}
											// 	cancel={this.handlePromotModalVisible}
											// 	tips={"更新到最新版本才能正常提现哦"}
											// 	confirm={() => {
											// 		this.handlePromotModalVisible();
											// 		this.openUrl("https://datizhuanqian.com/");
											// 	}}
											// />
										}

										{user.pay_account ? null : <WithdrawsTips navigation={navigation} />}
									</View>
								);
							}}
						</Query>
					) : (
						<NotLogin navigation={navigation} />
					)}
					<RuleDescriptionModal
						visible={RuleDescriptioVisible}
						handleVisible={this.RuleDescriptionModalVisible}
					/>
					<WithdrawsTipsModal
						visible={WithdrawsTipsVisible}
						handleVisible={this.WithdrawsTipsModalVisible}
						text={this.state.withdrawTips}
					/>
				</View>
			</Screen>
		);
	}
	handlePromotModalVisible() {
		this.setState(prevState => ({
			promotModalVisible: !prevState.promotModalVisible
		}));
	}

	RuleDescriptionModalVisible() {
		this.setState(prevState => ({
			RuleDescriptioVisible: !prevState.RuleDescriptioVisible
		}));
	}

	WithdrawsTipsModalVisible() {
		this.setState(prevState => ({
			WithdrawsTipsVisible: !prevState.WithdrawsTipsVisible
		}));
	}

	openUrl(url) {
		console.log('uri', url);
		Linking.openURL(url);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFEFC'
	},
	header: {
		paddingVertical: 25,
		alignItems: 'center'
	},
	gold: {
		color: Colors.themeRed,
		fontSize: 44,
		paddingBottom: 2,
		textAlign: 'center'
	},
	type: {
		color: Colors.grey,
		fontSize: 13,
		textAlign: 'center'
	},
	center: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: 15,
		justifyContent: 'space-between'
	},
	item: {
		paddingVertical: 25,
		width: (width - 44) / 2,
		borderColor: '#E0E0E0',
		borderWidth: 0.5,
		alignItems: 'center',
		marginTop: 20,
		borderRadius: 5
	},
	content: {
		fontSize: 16,
		color: Colors.black
	},
	footer: {
		alignItems: 'center',
		paddingBottom: 30
	},
	tips: {
		fontSize: 15,
		color: '#363636',
		paddingVertical: 10,
		lineHeight: 18
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(compose(graphql(CreateWithdrawMutation, { name: 'CreateWithdrawMutation' }))(HomeScreen));
