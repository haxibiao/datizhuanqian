import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Slider, TextInput, Dimensions } from "react-native";

import { Header } from "../../components/Header";
import { DivisionLine, TabTop } from "../../components/Universal";
import { Button } from "../../components/Control";
import Screen from "../Screen";
import { Colors, Methods } from "../../constants";

import { connect } from "react-redux";
import actions from "../../store/actions";

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
							<Text style={{ fontSize: 16, color: Colors.black }}>{user.gold}</Text>
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
											null;
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
							<Button
								name={"兑换"}
								disabled={!value}
								style={{ height: 40, marginHorizontal: 20, marginTop: 20 }}
								theme={Colors.blue}
								handler={() => {
									if (value > user.gold) {
										Methods.toast("超过智慧点余额");
									} else {
										Methods.toast("提现成功");
									}
								}}
							/>
						</View>
					) : (
						<View
							style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 15 }}
						>
							<Text style={{ color: Colors.grey, fontSize: 13 }}>
								您还没绑定支付宝账号, 请完善个人资料信息~
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
		backgroundColor: Colors.white
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
