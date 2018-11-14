import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions } from "react-native";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import { DivisionLine } from "../../components/Universal";

import Screen from "../Screen";

const { width, height } = Dimensions.get("window");

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let {} = this.state;
		const { navigation } = this.props;
		return (
			<Screen customStyle={{ borderBottomColor: "transparent" }}>
				<DivisionLine height={10} />
				<View style={styles.container} />
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
