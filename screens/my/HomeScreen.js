import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import Screen from "../Screen";
import { Header } from "../../components/Header";
import { Colors, Config, Divice } from "../../constants";

import { connect } from "react-redux";
import actions from "../../store/actions";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { user, navigation } = this.props;
		console.log("user", user);
		return (
			<Screen header>
				<View style={styles.container}>
					<Header leftComponent={<Text />} customStyle={{ backgroundColor: Colors.theme }} />
					<TouchableOpacity onPress={() => navigation.navigate("登录")}>
						<Text>我的</Text>
					</TouchableOpacity>
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

export default connect(store => {
	return { user: store.user.personal };
})(HomeScreen);
