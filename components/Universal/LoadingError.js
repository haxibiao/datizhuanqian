import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from "react-native";

import Colors from "../../constants/Colors";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width * 0.6;

class LoadingError extends Component {
	render() {
		let { size = 70, fontSize = 16, reload = () => null, text } = this.props;
		return (
			<View style={styles.container}>
				<Image style={styles.image} source={require("../../assets/images/network.jpg")} />
				<Text style={{ fontSize, color: Colors.tintFont, marginVertical: 15, fontWeight: "300" }}>
					{text ? text : "哎呀，好像出了点问题"}
				</Text>
				<TouchableOpacity onPress={reload}>
					<Text style={styles.reload}>重新加载</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20,
		backgroundColor: Colors.white
	},
	image: {
		width: IMAGE_WIDTH,
		height: IMAGE_WIDTH / 2,
		resizeMode: "contain"
	},
	reload: {
		fontSize: 15,
		color: Colors.blue,
		textAlign: "center"
	}
});

export default LoadingError;
