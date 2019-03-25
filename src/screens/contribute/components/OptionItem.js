/*
 * @flow
 * created by wyk made in 2019-02-14 11:36:47
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Iconfont } from '../../../components';
import { Theme, PxFit } from '../../../utils';

class OptionItem extends Component {
	render() {
		const { style, option, isAnswer, reduceAnswer, remove } = this.props;
		if (!reduceAnswer || !remove) {
			return (
				<View style={[styles.optionItem, style]}>
					<View style={[styles.optionLabel, isAnswer && styles.rightOption]}>
						{isAnswer ? (
							<Iconfont name="correct" size={PxFit(16)} color={'#fff'} />
						) : (
							<Text style={styles.optionLabelText}>{option.Value}</Text>
						)}
					</View>
					<View style={styles.optionContent}>
						<Text style={[styles.optionContentText, isAnswer && styles.correctText]}>{option.Text}</Text>
					</View>
				</View>
			);
		}
		return (
			<TouchableOpacity style={[styles.optionItem, style]} onPress={() => reduceAnswer(option)}>
				<View style={[styles.optionLabel, isAnswer && styles.rightOption]}>
					{isAnswer ? (
						<Iconfont name="correct" size={PxFit(16)} color={'#fff'} />
					) : (
						<Text style={styles.optionLabelText}>{option.Value}</Text>
					)}
				</View>
				<View style={styles.optionContent}>
					<Text style={[styles.optionContentText, isAnswer && styles.correctText]}>{option.Text}</Text>
				</View>
				<TouchableOpacity style={styles.closeItem} onPress={() => remove(option)}>
					<Iconfont name="close" size={PxFit(20)} color={'#696482'} />
				</TouchableOpacity>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	optionItem: {
		flexDirection: 'row'
	},
	optionLabel: {
		marginRight: PxFit(15),
		width: PxFit(34),
		height: PxFit(34),
		borderRadius: PxFit(17),
		borderWidth: PxFit(1),
		borderColor: Theme.borderColor,
		justifyContent: 'center',
		alignItems: 'center'
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
	},
	closeItem: {
		width: PxFit(34),
		height: PxFit(34),
		borderRadius: PxFit(17),
		backgroundColor: Theme.groundColour,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default OptionItem;
