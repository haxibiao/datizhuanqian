import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions } from "react-native";

import { Colors, Config, Divice } from "../../constants";
import { Header } from "../../components/Header";

import Screen from "../Screen";
import LoginInput from "./LoginInput";

const { width, height } = Dimensions.get("window");

class SignIn extends Component {
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
		let { switchView, handleSubmit, navigation } = this.props;
		return (
			<View style={styles.container}>
				<View style={{ justifyContent: "space-between", flex: 1 }}>
					<View style={styles.top}>
						<Image source={require("../../assets/images/logo.png")} style={styles.logo} />
					</View>
					<View>
						<View>
							<LoginInput
								name={"user"}
								keys={"account"}
								focusItem={focusItem}
								value={this.accountState.account}
								focusKey={this.focusKey}
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
								focusKey={this.focusKey}
								placeholder={"密码"}
								changeValue={this.changeValue}
							/>
						</View>
						<View style={{ marginTop: 10, alignItems: "flex-end" }}>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate("验证");
								}}
							>
								<Text
									style={{
										fontSize: 14,
										color: Colors.tintFont
									}}
								>
									忘记密码？
								</Text>
							</TouchableOpacity>
						</View>
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
								<Text style={styles.signInBtnText}>登录</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ alignItems: "center" }}>
						<View
							style={{
								marginVertical: 15,
								flexDirection: "row"
							}}
						>
							<Text
								style={{
									fontSize: 16,
									color: Colors.tintFontColor
								}}
							>
								还没有账号？
							</Text>
							<TouchableOpacity onPress={switchView}>
								<Text
									style={{
										fontSize: 16,
										color: Colors.theme
									}}
								>
									注册
								</Text>
							</TouchableOpacity>
						</View>
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
		paddingVertical: 15,
		justifyContent: "space-between"
	},
	top: {
		marginTop: 20,
		marginBottom: 20,
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
		fontSize: 18,
		fontWeight: "300",
		color: "#fff"
	}
});

export default SignIn;
