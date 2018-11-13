import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from "react-native";
import { Header } from "../../components/Header";
import { DivisionLine } from "../../components/Universal";
import { Colors, Config, Divice } from "../../constants";

import Screen from "../Screen";
import TopUserInfo from "./TopUserInfo";

import { connect } from "react-redux";
import actions from "../../store/actions";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { user, navigation } = this.props;
		return (
			<Screen header>
				<View style={styles.container}>
					<Header leftComponent={<Text />} customStyle={{ backgroundColor: Colors.theme }} />
					<DivisionLine height={10} />
					<ScrollView bounces={false}>
						<TopUserInfo user={user} navigation={navigation} />
						<TouchableOpacity onPress={() => navigation.navigate("登录")}>
							<Text>我的</Text>
						</TouchableOpacity>
					</ScrollView>
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
