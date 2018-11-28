import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions } from "react-native";

import { Header } from "../../components/Header";
import { TabTop } from "../../components/Universal";
import Screen from "../Screen";
import { Colors, Config, Divice } from "../../constants";

import { connect } from "react-redux";
import actions from "../../store/actions";

const { width, height } = Dimensions.get("window");

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
					<Header
						leftComponent={<Text />}
						customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
					/>
					<TabTop user={counts} />
					<View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
						<Image
							source={require("../../assets/images/record.jpg")}
							style={{ width: width / 3, height: width / 3 }}
						/>
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
		backgroundColor: "#FFFEFC"
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(HomeScreen);
