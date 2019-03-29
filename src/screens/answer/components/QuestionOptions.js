/*
 * @flow
 * created by wyk made in 2019-03-27 11:50:09
 */

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { Player } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

import OptionItem from './OptionItem';

class QuestionOption extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let { selections, submited, answer, selectedOption, onSelectOption } = this.props;
		let singleOption = answer && answer.length === 1;
		return (
			<View style={styles.options}>
				{selections.map((option, index) => {
					return (
						<OptionItem
							key={index}
							submited={submited}
							option={option}
							selectedOption={selectedOption}
							onSelectOption={onSelectOption}
							singleOption={singleOption}
							correct={answer && answer.includes(option.Value)}
						/>
					);
				})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	options: {
		marginHorizontal: PxFit(10)
	}
});

export default QuestionOption;
