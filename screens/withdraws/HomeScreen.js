import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Slider, TextInput, Dimensions, Image, Linking } from "react-native";
import { Header } from "../../components/Header";
import { DivisionLine, TabTop, Banner, LoadingError, BlankContent, WithdrawsTips } from "../../components/Universal";
import { CheckUpdateModal, RuleDescriptionModal } from "../../components/Modal";
import { Button } from "../../components/Control";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";
import NotLogin from "./NotLogin";
import { Colors, Methods } from "../../constants";

import { connect } from "react-redux";
import actions from "../../store/actions";

import {
	CreateTransactionMutation,
	TransactionsQuery,
	CreateWithdrawMutation,
	WithdrawsQuery
} from "../../graphql/withdraws.graphql";

import { UserQuery } from "../../graphql/User.graphql";
import { Mutation, Query, compose, graphql } from "react-apollo";

import codePush from "react-native-code-push";

const { width, height } = Dimensions.get("window");

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.handlePromotModalVisible = this.handlePromotModalVisible.bind(this);
		this._withdraws = this._withdraws.bind(this);
		this.state = {
			value: 0,
			promotModalVisible: false,
			exchangeRate: 600 //汇率
		};
	}

	//提现
	async _withdraws(user_gold, user_id, amount) {
		let { exchangeRate } = this.state;
		let result = {};
		if (user_gold / exchangeRate < amount) {
			Methods.toast("智慧点不足", -100);
		} else {
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
				let info = result.errors.toString().indexOf("Cannot");
				if (info > -1) {
					codePush.checkForUpdate().then(update => {
						if (!update) {
							Methods.toast("请重启APP完成更新", -100);
						} else {
							codePush.sync({
								updateDialog: {
									// mandatoryContinueButtonLabel: "更新",
									// mandatoryUpdateMessage: "有新版本了，请您及时更新",
									optionalIgnoreButtonLabel: "取消",
									optionalInstallButtonLabel: "后台更新",
									optionalUpdateMessage: "发现新版本",
									title: "更新提示"
								},
								installMode: codePush.InstallMode.IMMEDIATE
							});
						}
					});
					//过渡办法
				} else {
					let str = result.errors.toString().replace(/Error: GraphQL error: /, "");
					Methods.toast(str, -100); //打印错误信息
				}
			} else {
				Methods.toast("发起提现成功,客服人员会尽快处理您的提现请求。", -100);
			}
		}
	}

	render() {
		const { value, promotModalVisible, exchangeRate } = this.state;
		const { user, login, navigation } = this.props;
		return (
			<Screen header>
				<View style={styles.container}>
					<Header
						leftComponent={<Text />}
						customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
						rightComponent={
							<TouchableOpacity>
								<Iconfont name={"question"} size={18} />
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
										<View>
											<View style={styles.header}>
												<Text style={styles.gold}>{data.user.gold}</Text>
												<Text style={styles.type}>智慧点</Text>
											</View>
											<DivisionLine height={10} />
											<View style={styles.center}>
												<TouchableOpacity
													style={styles.item}
													onPress={() => {
														this._withdraws(data.user.gold, user.id, 1);
													}}
												>
													<Text style={styles.content}>
														提现<Text style={{ color: Colors.themeRed }}>1元</Text>
													</Text>
												</TouchableOpacity>
												<TouchableOpacity
													style={styles.item}
													onPress={() => {
														this._withdraws(data.user.gold, user.id, 2);
													}}
												>
													<Text style={styles.content}>
														提现<Text style={{ color: Colors.themeRed }}>2元</Text>
													</Text>
												</TouchableOpacity>
												<TouchableOpacity
													style={styles.item}
													onPress={() => {
														this._withdraws(data.user.gold, user.id, 5);
													}}
												>
													<Text style={styles.content}>
														提现<Text style={{ color: Colors.themeRed }}>5元</Text>
													</Text>
												</TouchableOpacity>
												<TouchableOpacity
													style={styles.item}
													onPress={() => {
														this._withdraws(data.user.gold, user.id, 10);
													}}
												>
													<Text style={styles.content}>
														提现<Text style={{ color: Colors.themeRed }}>10元</Text>
													</Text>
												</TouchableOpacity>
											</View>
											{user.pay_account && (
												<View style={styles.footer}>
													<Text style={styles.tips}>当前汇率：600智慧点=1元</Text>
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

										{user.pay_account ? null : <WithdrawsTips />}
									</View>
								);
							}}
						</Query>
					) : (
						<NotLogin navigation={navigation} />
					)}
					<RuleDescriptionModal visible={false} />
				</View>
			</Screen>
		);
	}
	handlePromotModalVisible() {
		this.setState(prevState => ({
			promotModalVisible: !prevState.promotModalVisible
		}));
	}

	openUrl(url) {
		console.log("uri", url);
		Linking.openURL(url);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFEFC"
	},
	header: {
		paddingVertical: 25,
		alignItems: "center"
	},
	gold: {
		color: "#EF514A",
		fontSize: 30,
		paddingBottom: 2
	},
	type: {
		color: Colors.grey,
		fontSize: 13,
		textAlign: "center"
	},
	center: {
		flexDirection: "row",
		flexWrap: "wrap",
		paddingHorizontal: 15,
		justifyContent: "space-between"
	},
	item: {
		paddingVertical: 25,
		width: (width - 44) / 2,
		borderColor: "#E0E0E0",
		borderWidth: 0.5,
		alignItems: "center",
		marginTop: 20,
		borderRadius: 5
	},
	content: {
		fontSize: 16,
		color: Colors.black
	},
	footer: {
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 20
	},
	tips: {
		fontSize: 15,
		color: "#363636"
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(compose(graphql(CreateWithdrawMutation, { name: "CreateWithdrawMutation" }))(HomeScreen));
