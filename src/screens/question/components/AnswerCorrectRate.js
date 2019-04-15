/*
 * @flow
 * created by wyk made in 2019-04-15 18:15:55
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Keyboard, DeviceEventEmitter } from 'react-native';
import { Theme, PxFit, Tools } from '../../../utils';
import { Iconfont, Row } from '../../../components';

class AnswerCorrectRate extends Component {
	render() {
		let { correct, count } = this.props;
		console.log('correct, count', correct, count);
		return (
			<Row style={styles.tipsView}>
				<Text style={styles.countText}>答对率 {correctRate(correct, count)}</Text>
				<Text style={styles.countText}>被答次数 {Tools.NumberFormat(count)}</Text>
			</Row>
		);
	}
}

function correctRate(correct, count) {
	if (typeof correct === 'number' && typeof count === 'number') {
		let result = (correct / count) * 100;
		if (result) {
			return result.toFixed(1) + '%';
		}
		return '暂无统计';
	}
}

const styles = StyleSheet.create({
	tipsView: {
		padding: PxFit(10),
		marginHorizontal: PxFit(Theme.itemSpace),
		justifyContent: 'space-between'
	},
	countText: {
		fontSize: PxFit(14),
		color: Theme.defaultTextColor
	}
});

export default AnswerCorrectRate;
