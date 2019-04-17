import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Linking } from 'react-native';
import {
	DivisionLine,
	LoadingError,
	BlankContent,
	WithdrawsTips,
	Header,
	RuleDescriptionModal,
	WithdrawsTipsModal,
	Button,
	Screen,
	WithdrawsNotLogin,
	UserWithdrawsCache,
	Iconfont,
	SubmitLoading
} from '../../components';

import { Colors, Divice } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { CreateWithdrawMutation, WithdrawsQuery } from '../../graphql/withdraws.graphql';
import { UserQuery } from '../../graphql/User.graphql';
import { Mutation, Query, compose, graphql } from 'react-apollo';

import codePush from 'react-native-code-push';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.RuleDescriptionModalVisible = this.RuleDescriptionModalVisible.bind(this);
		this.WithdrawsTipsModalVisible = this.WithdrawsTipsModalVisible.bind(this);
		this.handleWithdraws = this.handleWithdraws.bind(this);
		this.state = {
			promotModalVisible: false,
			RuleDescriptioVisible: false,
			WithdrawsTipsVisible: false,
			EXCHANGE_RATE: 600, //汇率
			clickControl: false,
			isVisible: false,
			withdrawTips: '智慧点不足，快去答题赚钱吧~'
		};
	}

	//发起提现请求
	async handleWithdraws(amount) {
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
			Methods.toast(str, -150); //Toast错误信息

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

	render() {
		let { EXCHANGE_RATE, RuleDescriptioVisible, WithdrawsTipsVisible, clickControl, isVisible } = this.state;
		const { user, login, navigation, luckyMoney } = this.props;
		return (
			<Screen header>
				<Header
					headerLeft
					customStyle={{
						backgroundColor: RuleDescriptioVisible || WithdrawsTipsVisible ? '#977018' : Colors.theme,
						borderBottomWidth: 0,
						borderBottomColor: 'transparent'
					}}
					headerRight={
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
					<Query query={UserQuery} variables={{ id: user.id }}>
						{({ data, loading, error, refetch }) => {
							//点击刷新
							navigation.addListener('didFocus', payload => {
								refetch();
							});

							if (error) return <UserWithdrawsCache luckyMoney={luckyMoney} />;
							if (!(data && data.user)) return <BlankContent />;

							return (
								<View style={styles.container}>
									<View style={styles.header}>
										<View style={{ width: Divice.width / 2 }}>
											<Text style={styles.gold}>{data.user.gold}</Text>
											<Text style={styles.type}>智慧点</Text>
										</View>
										<View style={{ width: Divice.width / 2 }}>
											<Text style={styles.gold}>
												{data.user.wallet && data.user.wallet.available_balance
													? `${data.user.wallet.available_balance}.00`
													: '0.00'}
											</Text>
											<Text style={styles.type}>余额（元）</Text>
										</View>
									</View>

									<DivisionLine height={10} />
									<View style={styles.main}>
										<View style={styles.center}>
											{luckyMoney.map((luckyMoney, index) => {
												return (
													<TouchableOpacity
														style={styles.item}
														onPress={() => {
															this.handleWithdraws(luckyMoney.value);
														}}
														disabled={clickControl}
														key={index}
													>
														<Text style={styles.content}>
															提现
															<Text style={{ color: Colors.themeRed }}>
																{luckyMoney.value}元
															</Text>
														</Text>
													</TouchableOpacity>
												);
											})}
										</View>
										{user.pay_account && (
											<View style={styles.footer}>
												<Text style={styles.tips}>当前汇率：600智慧点=1元</Text>
												<Button
													name={'查看提现日志'}
													style={{
														height: 38,
														borderRadius: 19,
														width: Divice.width - 80
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
									{user.pay_account ? null : <WithdrawsTips navigation={navigation} />}
								</View>
							);
						}}
					</Query>
				) : (
					<WithdrawsNotLogin navigation={navigation} />
				)}
				<RuleDescriptionModal
					visible={RuleDescriptioVisible}
					handleVisible={this.RuleDescriptionModalVisible}
					user={user}
				/>
				<WithdrawsTipsModal
					visible={WithdrawsTipsVisible}
					handleVisible={this.WithdrawsTipsModalVisible}
					text={this.state.withdrawTips}
				/>
				<SubmitLoading isVisible={isVisible} tips={'加载中...'} bgc={'rgba(255,255,255, 0)'} />
			</Screen>
		);
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
		Linking.openURL(url);
	}
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
		paddingTop: 20,
		paddingBottom: 30
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
	main: {
		justifyContent: 'space-between',
		flex: 1
	},
	center: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: 15,
		justifyContent: 'space-between'
	},
	item: {
		paddingVertical: 25,
		width: (Divice.width - 44) / 2,
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
		login: store.users.login,
		luckyMoney: store.withdraws.luckyMoney
	};
})(compose(graphql(CreateWithdrawMutation, { name: 'CreateWithdrawMutation' }))(HomeScreen));
