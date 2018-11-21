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
					<Text style={styles.text}> 精力点</Text>
					<Text
						style={{
							fontSize: 15,
							paddingLeft: 5,
							color: user.count_energy > 10 ? Colors.black : Colors.red
						}}
					>
						{user.count_energy}
					</Text>
					<Text style={styles.text}>/180</Text>
				</View>
				<View style={styles.rowItem}>
					<Iconfont name={"zhuanshi"} size={22} color={Colors.theme} />
					<Text style={[styles.text, { paddingRight: 5 }]}>智慧点</Text>
					<Text style={styles.text}>{user.count_wisdom}/180</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 55,
		backgroundColor: Colors.white,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		elevation: 3,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: Colors.lightGray,
		shadowOpacity: 0.1
	},
	rowItem: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	text: {
		fontSize: 15,
		color: Colors.black
	}
});

export default TabTop;
