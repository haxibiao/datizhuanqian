import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image } from "react-native";

import { Header } from "../../components/Header";
import { DivisionLine } from "../../components/Universal";
import { Colors, Config, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";
import PlateItem from "./PlateItem";

import { connect } from "react-redux";
import actions from "../../store/actions";

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { plate, navigation } = this.props;
		return (
			<Screen header>
				<Header leftComponent={<Text />} customStyle={{ backgroundColor: Colors.theme }} />
				<View style={styles.container}>
					<FlatList
						data={plate}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item, index }) => <PlateItem plate={item} navigation={navigation} />}
						ListHeaderComponent={() => {
							return <DivisionLine height={10} />;
						}}
					/>
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

export default connect(store => {
	return {
		plate: store.question.plate
	};
})(HomeScreen);
