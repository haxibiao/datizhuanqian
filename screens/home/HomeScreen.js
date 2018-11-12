import React, { Component } from "react";
import { StyleSheet, View, ImageBackground, TouchableOpacity, TouchableHighlight, Text } from "react-native";

import { Header } from "../../components/Header";
import { Colors, Config, Divice } from "../../constants";

import Screen from "../Screen";

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
					<Text>首页</Text>
				</View>
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

export default HomeScreen;
