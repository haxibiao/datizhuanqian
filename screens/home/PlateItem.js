import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";

import { Colors } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

class PlateItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { plate, navigation } = this.props;
		return (
			<TouchableOpacity
				style={styles.container}
				onPress={() => {
					navigation.navigate("回答", {
						plate_id: plate.id
					});
				}}
			>
				<View style={styles.leftContent}>
					<Image source={plate.avatar} style={styles.img} />
					<View style={{ paddingLeft: 20 }}>
						<Text style={styles.title}>{plate.name}</Text>
						<Text style={styles.content}>{plate.description}</Text>
					</View>
				</View>
				<Iconfont name={"right"} size={16} />
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder,
		paddingHorizontal: 15
	},
	leftContent: {
		flexDirection: "row",
		alignItems: "center"
	},
	img: {
		width: 64,
		height: 64,
		borderRadius: 2
	},
	title: {
		fontSize: 15,
		fontWeight: "500",
		color: Colors.black
	},
	content: {
		fontSize: 13,
		color: Colors.tintFont,
		paddingTop: 10
	}
});

export default PlateItem;
