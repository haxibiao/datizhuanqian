import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";

class Button extends Component {
	render() {
		let {
			style = {},
			outline, //镂空按钮
			theme = Colors.theme, //边框/背景/文字颜色
			name,
			fontSize = 16,
			icon, //自定义icon
			iconName, //iconName
			iconSize = fontSize,
			handler,
			disabled = false
		} = this.props;
		let mergeButton = StyleSheet.flatten([
			styles.button,
			{ borderColor: theme },
			!outline && { backgroundColor: theme },
			style,
			disabled && { opacity: 0.5 }
		]);
		return (
			<TouchableOpacity onPress={handler} style={mergeButton} disabled={disabled}>
				{icon
					? icon
					: iconName && <Iconfont name={iconName} size={iconSize} color={outline ? theme : "#fff"} />}
				<Text style={[{ fontSize: fontSize, color: theme }, !outline && { color: "#fff" }]}>{name}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		borderRadius: 5,
		borderWidth: 1
	}
});

export default Button;
