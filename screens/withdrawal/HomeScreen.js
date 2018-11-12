import React, { Component } from "react";
import { StyleSheet, View, ImageBackground, TouchableOpacity, TouchableHighlight, Text } from "react-native";

import { Header } from "../../components/Header";
import Screen from "../Screen";
import { Colors, Config, Divice } from "../../constants";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<Screen header>
				<View style={styles.container}>
					<Header leftComponent={<Text />} customStyle={{ backgroundColor: Colors.theme }} />
					<Text>提现</Text>
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

export default HomeScreen;
