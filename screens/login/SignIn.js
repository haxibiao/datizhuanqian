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
		let { SwitchView } = this.props;
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
						placeholder={"手机号码"}
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
						placeholder={"密码"}
						// changeValue={this.changeValue}
						// customStyle={{
						// 	borderTopWidth: 0,
						// 	borderBottomLeftRadius: 3,
						// 	borderBottomRightRadius: 3
						// }}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor,
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
	}
});

export default SignIn;
