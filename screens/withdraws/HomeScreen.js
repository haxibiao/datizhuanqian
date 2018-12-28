import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Slider, TextInput, Dimensions, Image, Linking } from "react-native";
import { Header } from "../../components/Header";
import { DivisionLine, TabTop, Banner, LoadingError, BlankContent } from "../../components/Universal";
import { CheckUpdateModal } from "../../components/Modal";
import { Button } from "../../components/Control";
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
import { Mutation, Query } from "react-apollo";

const { width, height } = Dimensions.get("window");

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.handlePromotModalVisible = this.handlePromotModalVisible.bind(this);
		this.state = {
			value: 0,
			promotModalVisible: false
		};
	}
	render() {
		const { value, promotModalVisible } = this.state;
		const { user, login, navigation } = this.props;
		return (
			<Screen header>
				<View style={styles.container}>
					<Header
						leftComponent={<Text />}
						customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
					/>
					{login ? (
						<Query query={UserQuery} variables={{ id: user.id }}>
							{({ data, loading, error, refetch }) => {
								if (error) return <LoadingError reload={() => refetch()} />;
								if (!(data && data.user)) return <BlankContent />;
								return (
									<View style={styles.container}>
										<TabTop user={user} />
										<View>
											<View style={styles.row}>
												<View style={styles.rowLeft}>
													<Text style={{ fontSize: 16, color: Colors.black }}>
														剩余智慧点
													</Text>
												</View>
												<View style={styles.center}>
													<Text style={{ fontSize: 16, color: Colors.black }}>
														{data.user.gold}
													</Text>
												</View>
											</View>
											<View style={{ alignItems: "center" }}>
												<Slider
													style={{ width: width - 20 }}
													minimumValue={0}
													maximumValue={data.user.gold}
													thumbTintColor={Colors.theme}
													minimumTrackTintColor={"#1E90FF"}
													value={this.state.value}
													onValueChange={value => {
														this.setState({
															value: value
														});
													}}
													step={100}
												/>
											</View>
											<View style={styles.row}>
												<View style={styles.rowLeft}>
													<Text style={{ fontSize: 16, color: Colors.black }}>
														兑换智慧点
													</Text>
													<Text style={{ fontSize: 11, color: Colors.grey }}>
														600倍数可提现
													</Text>
												</View>
												<View style={styles.center}>
													{user.pay_account ? (
														<TextInput
															style={styles.input}
															underlineColorAndroid="transparent"
															keyboardType="numeric"
															defaultValue={this.state.value.toString()}
															onChangeText={value => {
																if (value) {
																	this.setState({
																		value: parseInt(value)
																	});
																} else {
																	this.setState({
																		value: 0
																	});
																}
															}}
														/>
													) : (
														<TouchableOpacity
															onPress={() => {
																navigation.navigate("我的账户");
															}}
														>
															<Text style={{ fontSize: 16, color: Colors.black }}>
																请绑定支付宝
															</Text>
														</TouchableOpacity>
													)}
													{value > data.user.gold && (
														<Text style={{ fontSize: 11, color: Colors.red, marginTop: 2 }}>
															超过智慧点余额
														</Text>
													)}
												</View>
											</View>
										</View>
										{user.pay_account ? (
											<View>
												<View style={[styles.bottom, { backgroundColor: Colors.theme }]}>
													<View style={styles.center}>
														<Text style={styles.withdrawal}>提现金额</Text>
													</View>
													<View style={styles.center}>
														<Text style={styles.withdrawal}>
															￥{(value / 600).toFixed(0)}
														</Text>
													</View>
												</View>
												<View style={styles.bottom}>
													<View style={styles.center}>
														<Text style={styles.tips}>当前汇率</Text>
													</View>
													<View style={styles.center}>
														<Text style={styles.tips}>600智慧点=1元</Text>
													</View>
												</View>
												<Mutation mutation={CreateWithdrawMutation}>
													{createWithdrawal => {
														return (
															<Button
																name={"兑换"}
																disabled={!value || !Number.isInteger(value / 600)}
																style={{
																	height: 40,
																	marginHorizontal: 20,
																	marginTop: 20
																}}
																theme={Colors.blue}
																disabledColor={"rgba(64,127,207,0.7)"}
																handler={async () => {
																	this.setState({
																		value: 0
																	});
																	if (value > user.gold) {
																		Methods.toast("智慧点余额不足");
																	} else {
																		let result = {};
																		try {
																			result = await createWithdrawal({
																				variables: {
																					amount: (value / 600).toFixed(0)
																				},
																				refetchQueries: () => [
																					{
																						query: UserQuery,
																						variables: { id: user.id }
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
																			// let info = result.errors
																			// 	.toString()
																			// 	.indexOf("Cannot");
																			let str = result.errors
																				.toString()
																				.replace(/Error: GraphQL error: /, "");

																			Methods.toast(str, -100); //打印错误信息
																		} else {
																			Methods.toast(
																				"发起提现成功,客服人员会尽快处理您的提现请求。",
																				-100
																			);
																		}
																	}
																}}
															/>
														);
													}}
												</Mutation>
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
											</View>
										) : (
											<View
												style={{
													flex: 1,
													justifyContent: "center",
													alignItems: "center",
													paddingHorizontal: 15
												}}
											>
												<Image
													source={require("../../assets/images/alipay.jpg")}
													style={{ width: width / 3, height: width / 3 }}
												/>
												<Text style={{ color: Colors.grey, fontSize: 13, fontWeight: "300" }}>
													目前没有绑定支付宝账户哦
												</Text>
												<Text
													style={{
														color: Colors.grey,
														fontSize: 13,
														fontWeight: "300",
														paddingTop: 10
													}}
												>
													请前往我的-设置-我的账户页面进行绑定
												</Text>
											</View>
										)}
									</View>
								);
							}}
						</Query>
					) : (
						<NotLogin />
					)}
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
	row: {
		flexDirection: "row",
		justifyContent: "center",
		height: 60,
		marginVertical: 18
	},
	rowLeft: {
		flex: 1,
		borderRightColor: Colors.tintGray,
		borderRightWidth: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	input: {
		width: 90,
		height: 35,
		paddingVertical: 0,
		paddingTop: 5,
		paddingHorizontal: 5,
		borderRadius: 3,
		borderColor: Colors.tintGray,
		borderWidth: 1,
		fontSize: 16
	},
	bottom: {
		flexDirection: "row",
		justifyContent: "center",
		height: 55
	},
	withdrawal: {
		fontSize: 16,
		fontWeight: "500",
		color: Colors.white
	},
	tips: {
		fontSize: 13,
		color: Colors.grey
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		login: store.users.login
	};
})(HomeScreen);
