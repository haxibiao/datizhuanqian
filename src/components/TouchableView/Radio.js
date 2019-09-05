/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 11:03:28
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { Theme, PxFit } from '../../utils';

class Radio extends Component {
	render() {
		let { value, type, onCheck } = this.props;
		return (
			<TouchableOpacity
				style={{
					height: PxFit(20),
					width: PxFit(20),
					borderRadius: PxFit(10),
					borderColor: type == value ? Theme.theme : Theme.tintGray,
					borderWidth: PxFit(1),
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
						height: PxFit(10),
						width: PxFit(10),
						borderRadius: PxFit(5),
						backgroundColor: type == value ? Theme.theme : Theme.white
					}}
				/>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({});

export default Radio;
