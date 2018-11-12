import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { Header } from "../../components/Header";
import Screen from "../Screen";
import { Colors, Config, Divice } from "../../constants";

import SignIn from "./SignIn";
import SignUp from "./SignUp";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			login: false
		};
	}
	SwitchView() {
		this.setState(prevState => ({ login: !prevState.login }));
	}
	render() {
		const { login } = this.state;
		return (
			<Screen header>
				{login ? <SignUp handleSkip={this.handleSkip} /> : <SignIn handleSkip={this.handleSkip} />}
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	}
});

export default HomeScreen;
