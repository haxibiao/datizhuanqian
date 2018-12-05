import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from "react-native";
import { Header } from "../../components/Header";
import { DivisionLine, ErrorBoundary } from "../../components/Universal";
import { Colors, Config, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";

class TestError extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { user, navigation, login } = this.props;
		return (
			<Screen header>
				<Text>测试捕获异常</Text>
				{this.test()}
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default TestError;
