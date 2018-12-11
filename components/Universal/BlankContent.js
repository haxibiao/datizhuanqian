import React, { Component } from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";

import Colors from "../../constants/Colors";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width / 3;

class BlankContent extends Component {
	render() {
		let { size = 70, fontSize = 16, customStyle = {}, text = "这里还没有内容 ~", children } = this.props;
		return (
			<View style={styles.container}>
				<Image style={styles.image} source={require("../../assets/images/record.jpg")} />
				{children ? children : <Text style={{ fontSize, color: Colors.tintFont, marginTop: 12 }}>{text}</Text>}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20
		// backgroundColor: Colors.white
	},
	image: {
		width: IMAGE_WIDTH,
		height: IMAGE_WIDTH,
		resizeMode: "contain"
	}
});

export default BlankContent;
