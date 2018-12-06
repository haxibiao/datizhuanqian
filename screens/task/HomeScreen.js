import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions } from "react-native";

import { Header } from "../../components/Header";
import { TabTop, Banner, BlankContent } from "../../components/Universal";
import Screen from "../Screen";
import { Colors, Config, Divice } from "../../constants";

import { connect } from "react-redux";
import actions from "../../store/actions";

const { width, height } = Dimensions.get("window");

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counts: props.user,
			login: true
		};
	}
	render() {
		const { counts, login } = this.state;
		return (
			<Screen header>
				<View style={styles.container}>
					<Header
						leftComponent={<Text />}
						customStyle={{
							backgroundColor: Colors.theme,
							borderBottomWidth: 0
						}}
					/>
					{/*<TabTop user={counts} />*/}
					<Banner />
					{login ? (
						<View>
							<View
								style={{
									backgroundColor: Colors.white,
									borderRadius: 10,
									marginHorizontal: 15,
									marginTop: 50,
									height: 100,
									elevation: 10,
									shadowOffset: { width: 5, height: 5 },
									shadowColor: "#E8E8E8",
									shadowOpacity: 0.8,
									shadowRadius: 10
								}}
							>
								<Text>成长任务</Text>
							</View>
							<View
								style={{
									backgroundColor: Colors.white,
									borderRadius: 10,
									marginHorizontal: 15,
									marginTop: 30,
									height: 150,
									elevation: 10,
									shadowOffset: { width: 5, height: 5 },
									shadowColor: "#E8E8E8",
									shadowOpacity: 0.8,
									shadowRadius: 10
								}}
							>
								<Text>每日任务</Text>
							</View>

							<View
								style={{
									backgroundColor: Colors.white,
									borderRadius: 10,
									marginHorizontal: 15,
									marginTop: 50,
									height: 100,
									elevation: 1,
									shadowOffset: { width: 10, height: 10 },
									shadowColor: "#E8E8E8",
									shadowOpacity: 0.8,
									shadowRadius: 10
								}}
							>
								<Text>成长任务</Text>
							</View>
						</View>
					) : (
						<BlankContent />
					)}
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FAFAFA "
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(HomeScreen);
