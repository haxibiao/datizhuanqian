import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../../../constants/Colors";

class SettingItem extends Component {
	render() {
		let {
			itemName = "",
			explain = null,
			rightContent = "",
			leftComponent = null,
			rightComponent = null,
			endItem = false,
			horizontal = false
		} = this.props;
		return (
			<View
				style={[
					styles.settingItem,
					endItem && { borderBottomColor: "transparent" },
					horizontal && { justifyContent: "flex-start" }
				]}
			>
				{leftComponent ? (
					leftComponent
				) : (
					<View style={{ flex: 1 }}>
						<Text numberOfLines={1} style={styles.itemName}>
							{itemName}
						</Text>
						{explain && (
							<Text numberOfLines={1} style={styles.explain}>
								{explain}
							</Text>
						)}
					</View>
				)}
				{rightComponent ? (
					rightComponent
				) : (
					<View style={{ flex: 1 }}>
						<Text numberOfLines={1} style={styles.rightContent}>
							{rightContent}
						</Text>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	settingItem: {
		height: 60,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginHorizontal: 15
	},
	itemName: {
		fontSize: 15,
		color: Colors.black
	},
	explain: {
		fontSize: 12,
		color: Colors.tintFont,
		marginTop: 6
	},
	rightContent: {
		fontSize: 13,
		color: Colors.tintFont,
		textAlign: "right",
		paddingLeft: 15
	}
});

export default SettingItem;
