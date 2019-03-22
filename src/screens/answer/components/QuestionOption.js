/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:09:11
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { Player } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

class QuestionOption extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	// question.selections 结构不统一
	selectionAdapter(data) {
		let selection;
		if (Array.isArray(data)) {
			selection = data;
		} else if (typeof data === 'object') {
			selection = data.Selection || data.Section || [];
		}
		return selection;
	}

	render() {
		let { question, option = {}, swithMethod, value, changeValue, optionColor, rightColor } = this.props;
		let selection = this.selectionAdapter(option);
		return (
			<View>
				<View
					style={[
						styles.options,
						question.video
							? { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }
							: {}
					]}
				>
					{selection.map((option, index) => {
						return (
							<TouchableOpacity
								disabled={swithMethod}
								key={index}
								style={[
									question.video ? styles.valueOption : styles.option,
									{
										borderColor:
											value == option.Value
												? optionColor
												: option.Value == question.answer
												? rightColor
												: '#F0F0F0'
									}
								]}
								onPress={() => changeValue(option.Value)}
							>
								<Text numberOfLines={1}>{option.Text}</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	options: {
		paddingTop: PxFit(20)
	},
	option: {
		marginTop: PxFit(13),
		borderWidth: PxFit(1),
		borderRadius: PxFit(5),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: PxFit(12),
		paddingHorizontal: PxFit(15)
	},
	valueOption: {
		marginTop: PxFit(13),
		borderWidth: PxFit(1),
		borderRadius: PxFit(5),
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: PxFit(12),
		width: (SCREEN_WIDTH - PxFit(80)) / 2
	}
});

export default QuestionOption;
