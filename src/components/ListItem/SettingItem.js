import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants';

class SettingItem extends Component {
	render() {
		let {
			itemName = '',
			rightContent = '',
			leftComponent = null,
			rightComponent = null,
			endItem = false,
			customStyle = {},
			handler,
			disabled
		} = this.props;
		return (
			<TouchableOpacity
				style={[styles.settingItem, customStyle, endItem && { borderBottomColor: 'transparent' }]}
				onPress={handler}
				disabled={disabled}
			>
				{leftComponent ? (
					leftComponent
				) : (
					<View style={{ flex: 1 }}>
						<Text numberOfLines={1} style={styles.itemName}>
							{itemName}
						</Text>
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
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	settingItem: {
		height: 60,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 15
	},
	itemName: {
		fontSize: 15,
		color: Colors.black
	},
	rightContent: {
		fontSize: 13,
		color: Colors.tintFont,
		textAlign: 'right',
		paddingLeft: 15
	}
});

export default SettingItem;
