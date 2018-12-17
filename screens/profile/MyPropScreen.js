import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image } from "react-native";
import { Header } from "../../components/Header";
import { Button } from "../../components/Control";
import { DivisionLine, ErrorBoundary, ContentEnd } from "../../components/Universal";
import { Colors, Config, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import { connect } from "react-redux";

import Screen from "../Screen";

class MyPropScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let { user, navigation, login, prop } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<FlatList
						data={prop}
						keyExtractor={(item, index) => index.toString()}
						renderItem={this._propItem}
						ListFooterComponent={() => <ContentEnd />}
					/>
				</View>
			</Screen>
		);
	}
	_propItem = ({ item, index }) => {
		let { navigation } = this.props;
		return (
			<View style={styles.item}>
				<Image source={{ uri: item.logo }} style={styles.img} />
				<View style={styles.center}>
					<Text style={{ fontSize: 16, fontWeight: "500", lineHeight: 22 }}>{item.name}</Text>
					<Text>{item.time_ago}</Text>
				</View>
				<Button
					name={item.status ? "未使用" : "已使用"}
					style={{
						borderRadius: 5,
						height: 32,
						width: 84
					}}
					theme={item.status ? Colors.weixin : Colors.red}
					fontSize={14}
				/>
			</View>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightGray
	},
	item: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		// marginHorizontal: 15,
		paddingHorizontal: 15,
		paddingVertical: 15,
		marginTop: 10,
		backgroundColor: Colors.white
	},
	img: {
		width: 50,
		height: 50,
		borderRadius: 5
	},
	center: {
		height: 50,
		justifyContent: "space-between"
	}
});

export default connect(store => {
	return { prop: store.users.prop };
})(MyPropScreen);
