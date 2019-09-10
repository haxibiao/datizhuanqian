/*
 * @flow
 * created by wyk made in 2019-02-14 11:36:47
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Iconfont } from '../../../components';
import { Theme, PxFit } from '../../../utils';
import { observer, Provider, inject } from 'mobx-react';

const ANSWER = ['A', 'B', 'C', 'D'];

@observer
class OptionItem extends Component {
	render() {
		const { option, reduceAnswer, remove, label } = this.props;
		return (
			<TouchableOpacity style={styles.optionItem} onPress={() => reduceAnswer(option[0])}>
				<View style={[styles.optionLabel, option[1] && styles.rightOption]}>
					{option[1] ? (
						<Iconfont name="correct" size={PxFit(16)} color={'#fff'} />
					) : (
						<Text style={styles.optionLabelText}>{ANSWER[label]}</Text>
					)}
				</View>
				<View style={[styles.optionContent, { marginHorizontal: PxFit(10) }]}>
					<Text style={styles.optionContentText}>{option[0]}</Text>
				</View>
				<TouchableOpacity style={styles.closeItem} onPress={() => remove(option[0])}>
					<Iconfont name="trash" size={PxFit(24)} color={Theme.subTextColor} />
				</TouchableOpacity>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	optionItem: {
		flexDirection: 'row',
		marginTop: PxFit(Theme.itemSpace),
		marginBottom: PxFit(5),
	},
	optionLabel: {
		width: PxFit(34),
		height: PxFit(34),
		backgroundColor: Theme.primaryColor,
		borderRadius: PxFit(17),
		justifyContent: 'center',
		alignItems: 'center',
	},
	rightOption: { backgroundColor: Theme.correctColor },
	optionLabelText: {
		fontSize: PxFit(17),
		color: '#fff',
	},
	optionContent: {
		flex: 1,
		minHeight: PxFit(34),
		justifyContent: 'center',
	},
	optionContentText: {
		fontSize: PxFit(16),
		lineHeight: PxFit(18),
		color: Theme.defaultTextColor,
	},
	correctText: {
		color: Theme.correctColor,
	},
	closeItem: {
		width: PxFit(30),
		height: PxFit(34),
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default OptionItem;
