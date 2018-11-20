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
			value: 0,
			alipay: 0,
			counts: props.user
		};
	}
	render() {
		const { alipay, counts, value } = this.state;
		return (
			<Screen header>
				<View style={styles.container}>
					<Header leftComponent={<Text />} customStyle={{ backgroundColor: Colors.theme }} />
					<TabTop user={counts} />
					<View style={styles.row}>
						<View style={styles.rowLeft}>
							<Text style={{ fontSize: 16 }}>剩余智慧点</Text>
						</View>
						<View style={styles.center}>
							<Text style={{ fontSize: 16 }}>{counts.count_wisdom}</Text>
						</View>
					</View>
					<View style={{ alignItems: "center" }}>
						<Slider
							style={{ width: 320 }}
							minimumValue={0}
							maximumValue={counts.count_wisdom}
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
							<Text style={{ fontSize: 16 }}>兑换智慧点</Text>
							<Text style={{ fontSize: 11, color: Colors.grey }}>大于300可提现</Text>
						</View>
						<View style={styles.center}>
							{alipay ? (
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
								<Text style={{ fontSize: 16 }}>请绑定支付宝</Text>
							)}
						</View>
					</View>
					{alipay ? (
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
								style={{ height: 40, marginHorizontal: 20, marginTop: 20 }}
								theme={Colors.blue}
								handler={() => {
									if (value > counts.count_wisdom) {
										Methods.toast("超过智慧点余额");
									} else {
										Methods.toast("提现成功");
									}
								}}
							/>
						</View>
					) : (
						<View>
							<View
								style={{
									alignItems: "center",
									borderBottomColor: Colors.grey,
									borderBottomWidth: 1
								}}
							>
								<Text style={{ fontSize: 18 }}>支付宝账号</Text>
								<TextInput
									style={{
										width: width - 100,
										marginTop: 20,
										height: 30,
										paddingBottom: 5
									}}
									underlineColorAndroid="transparent"
									onChangeText={() => {}}
								/>
							</View>
							<View style={{ paddingHorizontal: 30, marginTop: 30 }}>
								<Text style={{ fontSize: 16 }}>
									支付宝账号为提现有效证据,请输入已经通过实名认证的支付宝账号,否则提现将失败.
								</Text>
								<Text style={{ fontSize: 16, color: Colors.orange, paddingTop: 25 }}>
									注意:支付宝账号一旦绑定将无法更改！
								</Text>
							</View>
							<Button
								name={"提交"}
								style={{ height: 40, marginHorizontal: 20, marginTop: 20 }}
								theme={Colors.blue}
								handler={() => {}}
							/>
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
		backgroundColor: Colors.skinColor
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
		user: store.user.personal
	};
})(HomeScreen);
