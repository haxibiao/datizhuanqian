import React, { Component } from "react";
import Colors from "../../constants/Colors";

import { StyleSheet, View, Text } from "react-native";

class ContentEnd extends Component {
	render() {
		let { content = "暂时没有更多了~" } = this.props;
		return (
			<View style={styles.contentEnd}>
				<Text style={styles.endText}>{content}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	contentEnd: {
		paddingVertical: 20
	},
	endText: {
		textAlign: "center",
		fontSize: 12,
		color: Colors.tintFont
	}
});

export default ContentEnd;
