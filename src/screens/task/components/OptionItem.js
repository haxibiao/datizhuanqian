/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:37:30
 */

/*
 * @flow
 * created by wyk made in 2019-02-14 11:36:47
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Iconfont } from '../../components';
import { Theme, PxFit } from '../../utils';

class OptionItem extends Component {
	render() {
		const { style, option, isAnswer, reduceAnswer, remove } = this.props;
		if (!reduceAnswer || !remove) {
			return (
				<View style={[styles.optionItem, style]}>
					<View style={[styles.optionLabel, isAnswer && { backgroundColor: Theme.skyBlue, borderWidth: 0 }]}>
						<Text style={[styles.optionLabelText, isAnswer && { color: '#fff' }]}>{option.Value}</Text>
					</View>
					<View style={styles.optionContent}>
						<Text style={styles.optionContentText}>{option.Text}</Text>
					</View>
				</View>
			);
		}
		return (
			<TouchableOpacity style={[styles.optionItem, style]} onPress={() => reduceAnswer(option)}>
				<View style={[styles.optionLabel, isAnswer && { backgroundColor: Theme.skyBlue, borderWidth: 0 }]}>
					<Text style={[styles.optionLabelText, isAnswer && { color: '#fff' }]}>{option.Value}</Text>
				</View>
				<View style={styles.optionContent}>
					<Text style={styles.optionContentText}>{option.Text}</Text>
				</View>
				<TouchableOpacity style={{ marginTop: PxFit(8) }} onPress={() => remove(option)}>
					<Iconfont name="close" size={16} color={'#696482'} />
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
		width: PxFit(36),
		height: PxFit(36),
		borderRadius: PxFit(18),
		borderWidth: PxFit(2),
		borderColor: Theme.skyBlue,
		justifyContent: 'center',
		alignItems: 'center'
	},
	optionLabelText: {
		fontSize: PxFit(17),
		fontWeight: '500',
		color: Theme.skyBlue
	},
	optionContent: {
		flex: 1,
		minHeight: PxFit(36),
		justifyContent: 'center'
	},
	optionContentText: {
		fontSize: PxFit(16),
		lineHeight: PxFit(18),
		color: Theme.tintFont
	}
});

export default OptionItem;