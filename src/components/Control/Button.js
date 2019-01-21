import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import { Iconfont } from '../utils/Fonts';
import Colors from '../../constants/Colors';

class Button extends Component {
	render() {
		let {
			style = {},
			outline, //镂空按钮
			theme = Colors.theme, //边框/背景/文字颜色
			textColor = Colors.white,
			disabledColor = Colors.disabledColor,
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
			!outline && { backgroundColor: theme },
			style,
			disabled && { backgroundColor: disabledColor }
		]);
		return (
			<TouchableOpacity onPress={handler} style={mergeButton} disabled={disabled} activeOpacity={0.8}>
				{icon
					? icon
					: iconName && <Iconfont name={iconName} size={iconSize} color={outline ? theme : '#fff'} />}
				<Text style={[{ fontSize: fontSize, color: textColor }]}>{name}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		borderRadius: 5
	}
});

export default Button;
