import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { Header } from "../../components/Header";
import { TabTop } from "../../components/Universal";
import Screen from "../Screen";
import { Colors, Config, Divice } from "../../constants";

import { connect } from "react-redux";
import actions from "../../store/actions";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counts: props.user
		};
	}
	render() {
		const { counts } = this.state;
		return (
			<Screen header>
				<View style={styles.container}>
					<Header leftComponent={<Text />} customStyle={{ backgroundColor: Colors.theme }} />
					<TabTop user={counts} />
					<View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
						<Text>暂时没有任务哦~</Text>
					</View>
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
	return {
		user: store.user.personal
	};
})(HomeScreen);
