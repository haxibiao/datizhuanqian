import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Image } from "react-native";

import Screen from "../Screen";
import { Colors, Config, Divice } from "../../constants";

const { width, height } = Dimensions.get("window");

class CommonProblemScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counts: props.user
		};
	}
	render() {
		const { counts } = this.state;
		return (
			<Screen>
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

export default CommonProblemScreen;
