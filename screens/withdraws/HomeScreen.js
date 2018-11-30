import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Slider, TextInput, Dimensions, Image } from "react-native";

import { Header } from "../../components/Header";
import { DivisionLine, TabTop } from "../../components/Universal";
import { Button } from "../../components/Control";
import Screen from "../Screen";
import { Colors, Methods } from "../../constants";

import { connect } from "react-redux";
import actions from "../../store/actions";

import { CreateTransactionMutation } from "../../graphql/withdraws.graphql";
import { Mutation } from "react-apollo";

const { width, height } = Dimensions.get("window");

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 0
		};
	}
	render() {
		const { value } = this.state;
		const { user } = this.props;
		console.log("value", value);
		return (
			<Screen header>
				<View style={styles.container}>
					<Header
						leftComponent={<Text />}
						customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
					/>
					<TabTop user={user} />
					<View style={styles.row}>
						<View style={styles.rowLeft}>
							<Text style={{ fontSize: 16, color: Colors.black }}>剩余智慧点</Text>
						</View>
						<View style={styles.center}>
							<Text style={{ fontSize: 16, color: Colors.black }}>{user.gold ? user.gold : 0}</Text>
						</View>
					</View>
					<View style={{ alignItems: "center" }}>
						<Slider
							style={{ width: 320 }}
							minimumValue={0}
							maximumValue={user.gold}
							value={this.state.value}
							onValueChange={value => {
								this.setState({
									value: value
								});
							}}
							step={1}
						/>
					</View>
					<View style={styles.row}>
						<View style={styles.rowLeft}>
							<Text style={{ fontSize: 16, color: Colors.black }}>兑换智慧点</Text>
							<Text style={{ fontSize: 11, color: Colors.grey }}>大于300可提现</Text>
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
								<Text style={{ fontSize: 16, color: Colors.black }}>请绑定支付宝</Text>
							)}
						</View>
					</View>
					{user.pay_account ? (
						<View>
							<View style={[styles.bottom, { backgroundColor: Colors.theme }]}>
								<View style={styles.center}>
									<Text style={styles.withdrawal}>提现金额</Text>
								</View>
								<View style={styles.center}>
									<Text style={styles.withdrawal}>￥{(value / 600).toFixed(2)}</Text>
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
							<Mutation mutation={CreateTransactionMutation}>
								{createTransaction => {
									return (
										<Button
											name={"兑换"}
											disabled={!value}
											style={{ height: 40, marginHorizontal: 20, marginTop: 20 }}
											theme={Colors.blue}
											handler={async () => {
												if (value > user.gold) {
													Methods.toast("兑换失败,智慧点不足");
												} else {
													let result = {};
													try {
														result = await createTransaction({
															variables: {
																amount: value
															}
														});
													} catch (ex) {
														result.errors = ex;
													}
													if (result && result.errors) {
														Methods.toast("提现失败,请检查你的网络和智慧点余额");
													} else {
														this.props.dispatch(actions.widthdraws(user.gold - value)); //根据接口调整
														Methods.toast("发起提现成功,客服人员会尽快处理您的提现请求。");
													}
												}
											}}
										/>
									);
								}}
							</Mutation>
						</View>
					) : (
						<View
							style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 15 }}
						>
							<Image
								source={require("../../assets/images/alipay.jpg")}
								style={{ width: width / 3, height: width / 3 }}
							/>
							<Text style={{ color: Colors.grey, fontSize: 13, fontWeight: "300" }}>
								目前没有绑定支付宝账户哦
							</Text>
							<Text style={{ color: Colors.grey, fontSize: 13, fontWeight: "300", paddingTop: 10 }}>
								请前往我的-设置-我的账户页面进行绑定
							</Text>
						</View>
					)}
				</View>
			</Screen>
		);
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
		user: store.users.user
	};
})(HomeScreen);
