import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";

class TabTop extends Component {
	render() {
		const { user } = this.props;

		return (
			<View style={styles.container}>
				<View style={styles.rowItem}>
					<Iconfont name={"like"} size={24} color={Colors.theme} />
					<Text style={{ fontSize: 15 }}> 精力点</Text>
					<Text style={{ fontSize: 15 }}>{user.count_energy}/180</Text>
				</View>
				<View style={styles.rowItem}>
					<Iconfont name={"zhuanshi"} size={22} color={Colors.theme} />
					<Text style={{ fontSize: 15 }}>智慧点</Text>
					<Text style={{ fontSize: 15 }}>{user.count_wisdom}/180</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 55,
		backgroundColor: Colors.lightGray,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	rowItem: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	}
});

export default TabTop;
