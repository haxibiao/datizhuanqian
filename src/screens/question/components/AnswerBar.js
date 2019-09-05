/*
 * @flow
 * created by wyk made in 2019-06-06 10:00:18
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Keyboard, Animated } from 'react-native';
import { Theme, PxFit, Tools, SCREEN_WIDTH } from 'utils';
import { Iconfont, Row, TouchFeedback, Avatar } from 'components';

class AnswerBar extends Component {
	renderUsers = users => {
		if (!users || !(users instanceof Array) || !users.length > 0) {
			return null;
		}

		return (
			<View style={styles.usersContainer}>
				<Text style={styles.countText}>最近答对的同学：</Text>
				<Row>
					{users.slice(0, 10).map((elem, index) => {
						if (elem.user) {
							return (
								<TouchFeedback
									key={index}
									style={{ marginRight: -PxFit(6) }}
									onPress={() => this.props.navigation.navigate('User', { user: elem.user })}
								>
									<Avatar source={elem.user.avatar} size={PxFit(24)} />
								</TouchFeedback>
							);
						}
					})}
				</Row>
			</View>
		);
	};

	render() {
		let { question, isShow } = this.props;
		let { answer_logs, correct_count, count } = question;
		if (Tools.NumberFormat(count) == 0 || !isShow) {
			return null;
		}
		return (
			<View style={styles.shadowView} elevation={20}>
				<View style={styles.statisticsItem}>
					<Text style={styles.itemName}>作答人数</Text>
					<Text style={{ fontSize: PxFit(14), color: Theme.secondaryColor }}>
						{Tools.NumberFormat(count)}
					</Text>
				</View>
				<View style={styles.statisticsItem}>
					<Text style={styles.itemName}>正确率</Text>
					<Text style={{ fontSize: PxFit(14), color: Theme.primaryColor }}>
						{correctRate(correct_count, count)}
					</Text>
				</View>
				<View style={styles.statisticsItem}>
					<Text style={styles.itemName}>正确答案</Text>
					<Text style={{ fontSize: PxFit(14), color: Theme.correctColor }}>{question.answer}</Text>
				</View>
			</View>
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
	shadowView: {
		flexDirection: 'row',
		padding: PxFit(Theme.itemSpace),
		marginBottom: PxFit(20),
		borderRadius: PxFit(5),
		backgroundColor: '#fff',
		shadowColor: '#b4b4b4',
		shadowOffset: {
			width: 0,
			height: 0
		},
		shadowRadius: 1,
		shadowOpacity: 0.3
	},
	statisticsItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	itemName: {
		marginBottom: PxFit(Theme.itemSpace),
		fontSize: PxFit(15),
		fontWeight: '500',
		color: Theme.secondaryTextColor
	},
	usersContainer: {
		marginTop: PxFit(Theme.itemSpace),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
});

export default AnswerBar;
