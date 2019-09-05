/*
 * @flow
 * created by wyk made in 2019-06-05 11:57:36
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Iconfont } from '../../../components';
import { Theme, PxFit } from '../../../utils';

function FNOptionItem(props) {
	const { option } = props;
	return (
		<View style={styles.optionItem}>
			<View style={[styles.optionLabel, option[1] && styles.rightOption]}>
				<Iconfont name="correct" size={PxFit(16)} color={option[1] ? '#fff' : Theme.defaultTextColor} />
			</View>
			<View style={styles.optionContent}>
				<Text style={[styles.optionContentText, option[1] && styles.correctText]}>{option[0]}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	optionItem: {
		flexDirection: 'row',
		marginBottom: PxFit(Theme.itemSpace)
	},
	optionLabel: {
		marginRight: PxFit(15),
		width: PxFit(34),
		height: PxFit(34),
		borderRadius: PxFit(17),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Theme.groundColour
	},
	rightOption: { backgroundColor: Theme.correctColor, borderWidth: 0 },
	optionLabelText: {
		fontSize: PxFit(17),
		color: Theme.defaultTextColor
	},
	optionContent: {
		flex: 1,
		minHeight: PxFit(34),
		justifyContent: 'center'
	},
	optionContentText: {
		fontSize: PxFit(16),
		lineHeight: PxFit(17),
		color: Theme.defaultTextColor
	},
	correctText: {
		color: Theme.correctColor
	}
});

export default FNOptionItem;
