import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions, TextInput } from "react-native";

import { Header } from "../../components/Header";
import Screen from "../Screen";
import { Colors, Config, Divice } from "../../constants";

import LoginInput from "./LoginInput";

const { width, height } = Dimensions.get("window");

class SignUp extends Component {
	constructor(props) {
		super(props);
		this.focusKey = this.focusKey.bind(this);
		this.changeValue = this.changeValue.bind(this);
		this.emptyValue = this.emptyValue.bind(this);
		this.accountState = {
			account: "",
			password: ""
		};
		this.state = {
			focusItem: "account",
			modalVisible: false,
			disableSubmit: true
		};
	}

	focusKey(key) {
		this.setState({ focusItem: key });
	}

	changeValue(key, value) {
		this.accountState[key] = value;
		if (this.accountState.account && this.accountState.password) {
			this.setState({ disableSubmit: false });
		} else if (!this.state.disableSubmit) {
			this.setState({ disableSubmit: true });
		}
	}

	emptyValue(key) {
		this.accountState[key] = "";
	}
	render() {
		let { focusItem, modalVisible, disableSubmit } = this.state;
		let { switchView, handleSubmit } = this.props;
		return (
			<View style={styles.container}>
				<View style={{ flex: 1, justifyContent: "space-between" }}>
					<View style={styles.input}>
						<View style={styles.top}>
							<Image source={require("../../assets/images/logo.png")} style={styles.logo} />
						</View>
						<LoginInput
							name={"user"}
							keys={"account"}
							focusItem={focusItem}
							value={this.accountState.account}
							focusKey={this.focusKey.bind(this)}
							emptyValue={this.emptyValue}
							placeholder={"手机号码/邮箱"}
							changeValue={this.changeValue}
						/>
						<LoginInput
							name={"lock"}
							keys={"password"}
							focusItem={focusItem}
							value={this.accountState.password}
							secure={true}
							focusKey={this.focusKey.bind(this)}
							placeholder={"设置密码"}
							changeValue={this.changeValue}
						/>
						{/*<LoginInput
						name={"lock"}
						keys={"verificationCode"}
						value={this.accountState.verificationCode}
						focusKey={this.focusKey.bind(this)}
						placeholder={"请输入验证码"}
						code={true}
						// changeValue={this.changeValue}
						// customStyle={{
						// 	borderTopWidth: 0,
						// 	borderBottomLeftRadius: 3,
						// 	borderBottomRightRadius: 3
						// }}
					/>*/}
						<View style={{ marginTop: 20 }}>
							<TouchableOpacity
								disabled={disableSubmit}
								onPress={() => {
									if (!disableSubmit) {
										handleSubmit(this.accountState);
									}
									this.setState({
										disableSubmit: true
									});
								}}
								style={[
									styles.signInBtn,
									!disableSubmit && {
										backgroundColor: Colors.theme
									}
								]}
							>
								<Text style={styles.signInBtnText}>同意协议并注册</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View style={{ alignItems: "center" }}>
					<View style={{ marginVertical: 15 }}>
						<TouchableOpacity onPress={switchView}>
							<Text
								style={{
									fontSize: 16,
									color: Colors.theme
								}}
							>
								已有账号登录
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
		paddingHorizontal: 25,
		paddingVertical: 15
		// justifyContent: "space-between"
	},
	top: {
		marginVertical: 100,
		alignItems: "center"
	},
	logo: {
		width: width / 4,
		height: width / 4
	},
	input: {
		marginTop: 0
	},
	signInBtn: {
		height: 42,
		borderRadius: 5,
		backgroundColor: "rgba(255,177,0,0.7)",
		alignItems: "center",
		justifyContent: "center"
	},
	signInBtnText: {
		fontSize: 16,
		fontWeight: "300",
		color: "#fff"
	},
	codestyle: {
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		height: 46,
		lineHeight: 22,
		padding: 0,
		color: Colors.primaryFont
	}
});

export default SignUp;
