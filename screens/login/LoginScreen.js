import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { Header } from "../../components/Header";
import Screen from "../Screen";
import { Colors, Config, Divice, Methods } from "../../constants";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

import KeyboardSpacer from "react-native-keyboard-spacer";

import { connect } from "react-redux";
import actions from "../../store/actions";

import { signUpMutation, signInMutation } from "../../graphql/user.graphql";
import { graphql, compose } from "react-apollo";
import { NavigationActions } from "react-navigation";

class LoginScreen extends Component {
	constructor(props) {
		super(props);
		let login = props.navigation.getParam("login", false);
		this.state = {
			login
		};
	}
	switchView() {
		this.setState(prevState => ({ login: !prevState.login }));
	}
	render() {
		const { login } = this.state;
		const { navigation } = this.props;
		return (
			<Screen header>
				{login ? (
					<SignUp
						switchView={this.switchView.bind(this)}
						navigation={navigation}
						handleSubmit={this.handleSubmit}
					/>
				) : (
					<SignIn
						switchView={this.switchView.bind(this)}
						navigation={navigation}
						handleSubmit={this.handleSubmit}
					/>
				)}
				{Divice.isIos && <KeyboardSpacer />}
			</Screen>
		);
	}
	handleSubmit = async childState => {
		const { account, password } = childState;
		if (!this.state.login) {
			let result = {};
			try {
				result = await this.props.signInMutation({
					variables: {
						account,
						password
					}
				});
			} catch (ex) {
				result.errors = ex;
			}
			if (result && result.errors) {
				Methods.toast("登录失败，请检查邮箱和密码是否正确");
			} else {
				const user = result.data.signIn;
				this._saveUserData(user);
			}
		} else {
			let result = {};
			try {
				result = await this.props.signUpMutation({
					variables: {
						account,
						password
					}
				});
			} catch (ex) {
				result.errors = ex;
			}
			if (result && result.errors) {
				Methods.toast("注册失败，请检查邮箱地址是否已注册");
			} else {
				const user = result.data.signUp;
				this._saveUserData(user);
			}
		}
	};

	_saveUserData = user => {
		this.props.dispatch(actions.signIn(user));
		this.props.navigation.goBack();
		console.log("user", this.props.users.user);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default connect(store => {
	return { ...store };
})(
	compose(
		graphql(signUpMutation, { name: "signUpMutation" }),
		graphql(signInMutation, { name: "signInMutation" })
	)(LoginScreen)
);
