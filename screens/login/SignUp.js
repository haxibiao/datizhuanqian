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
		this.accountState = {
			email: "",
			password: ""
		};
		this.state = {
			focusItem: "email",
			modalVisible: false,
			disableSubmit: true
		};
	}

	focusKey(key) {
		this.setState({ focusItem: key });
	}
	render() {
		let { focusItem, modalVisible, disableSubmit } = this.state;
		let { switchView } = this.props;
		return (
			<View style={styles.container}>
				<View style={styles.top}>
					<Image source={require("../../assets/images/logo.png")} style={styles.logo} />
				</View>
				<View style={styles.input}>
					<LoginInput
						name={"user"}
						keys={"email"}
						focusItem={focusItem}
						value={this.accountState.email}
						focusKey={this.focusKey.bind(this)}
						// emptyValue={this.emptyValue}
						placeholder={"手机号码/邮箱"}
						// changeValue={this.changeValue}
						// customStyle={{
						// 	borderTopLeftRadius: 3,
						// 	borderTopRightRadius: 3
						// }}
					/>
					<LoginInput
						name={"lock"}
						keys={"password"}
						focusItem={focusItem}
						value={this.accountState.password}
						secure={true}
						focusKey={this.focusKey.bind(this)}
						placeholder={"设置密码"}
						// changeValue={this.changeValue}
						// customStyle={{
						// 	borderTopWidth: 0,
						// 	borderBottomLeftRadius: 3,
						// 	borderBottomRightRadius: 3
						// }}
					/>
					<LoginInput
						name={"lock"}
						keys={"password"}
						value={this.accountState.password}
						focusKey={this.focusKey.bind(this)}
						placeholder={"请输入验证码"}
						code={true}
						// changeValue={this.changeValue}
						// customStyle={{
						// 	borderTopWidth: 0,
						// 	borderBottomLeftRadius: 3,
						// 	borderBottomRightRadius: 3
						// }}
					/>
				</View>
				<View style={{ marginTop: 20 }}>
					<TouchableOpacity
						disabled={disableSubmit}
						onPress={() => {
							if (!disableSubmit) {
								this.props.handleSubmit(this.accountState);
							}
							this.setState({
								disableSubmit: true
							});
						}}
						style={[
							styles.signInBtn,
							!disableSubmit && {
								backgroundColor: "rgba(240,145,145,1)"
							}
						]}
					>
						<Text style={styles.signInBtnText}>同意协议并注册</Text>
					</TouchableOpacity>
				</View>
				<View style={{ alignItems: "center" }}>
					<View style={{ marginVertical: 15 }}>
						<TouchableOpacity onPress={switchView}>
							<Text
								style={{
									fontSize: 16,
									color: Colors.themeColor
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
		marginTop: 150,
		alignItems: "center"
	},
	logo: {
		width: width / 4,
		height: width / 4
	},
	input: {
		marginTop: 60
	},
	signInBtn: {
		height: 42,
		borderRadius: 5,
		backgroundColor: Colors.theme,
		alignItems: "center",
		justifyContent: "center"
	},
	signInBtnText: {
		fontSize: 18,
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
		color: Colors.primaryFontColor
	}
});

export default SignUp;
