/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 17:09:11
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { Player } from '../../../components';
import { Theme, SCREEN_WIDTH } from '../../../utils';

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
		let { question, option = {}, swithMethod, value, changeValue, pickColor, rightColor } = this.props;
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
												? pickColor
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
		paddingTop: 20
	},
	option: {
		marginTop: 13,
		borderWidth: 1,
		borderRadius: 5,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 15
	},
	valueOption: {
		marginTop: 13,
		borderWidth: 1,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 12,
		width: (SCREEN_WIDTH - 80) / 2
	}
});

export default QuestionOption;
