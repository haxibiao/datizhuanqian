import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { Header } from "../../components/Header";
import Screen from "../Screen";
import { Colors, Config, Divice } from "../../constants";

class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Screen header>
				<View style={styles.container}>
					<Text>任务</Text>
				</View>
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

export default SignUp;
