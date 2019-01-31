import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import { Colors } from '../../constants';
import { Iconfont } from '../utils/Fonts';

class PlateItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, customStyle = {}, IconStyle = {}, right, icon, name, size, handler } = this.props;
		return (
			<TouchableOpacity
				style={[styles.rowItem, customStyle]}
				onPress={handler ? handler : () => navigation.navigate(name)}
			>
				<View style={styles.itemLeft}>
					<Iconfont name={icon} size={size ? size : 18} style={IconStyle} />
					<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black }}>{name}</Text>
				</View>
				{right ? right : <Iconfont name={'right'} size={14} />}
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	rowItem: {
		height: 58,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder
	},
	itemLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

export default PlateItem;
