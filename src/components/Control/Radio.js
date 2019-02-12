import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import Colors from '../../constants/Colors';

class Radio extends Component {
	render() {
		let { value, type, onCheck } = this.props;
		return (
			<TouchableOpacity
				style={{
					height: 20,
					width: 20,
					borderRadius: 10,
					borderColor: type == value ? Colors.theme : Colors.tintGray,
					borderWidth: 1,
					justifyContent: 'center',
					alignItems: 'center'
				}}
				value={1}
				onPress={() => {
					onCheck(value);
				}}
			>
				<View
					style={{
						height: 10,
						width: 10,
						borderRadius: 5,
						backgroundColor: type == value ? Colors.theme : Colors.white
					}}
				/>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({});

export default Radio;
