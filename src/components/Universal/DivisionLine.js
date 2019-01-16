import React, { Component } from "react";
import Colors from "../../constants/Colors";

import { StyleSheet, View } from "react-native";

class DivisionLine extends Component {
	render() {
		let { height = 10, style = {} } = this.props;
		return <View style={[styles.divisionLine, { height }, style]} />;
	}
}

const styles = StyleSheet.create({
	divisionLine: {
		backgroundColor: Colors.lightGray
	}
});

export default DivisionLine;
