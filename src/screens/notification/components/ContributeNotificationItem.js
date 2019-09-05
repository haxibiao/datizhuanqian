/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 14:01:19
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Iconfont } from 'components';
import { Theme, Config, Tools } from 'utils';

class ContributeNotificationItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation, notification } = this.props;

		let data = JSON.parse(notification.data);

		return (
			<View style={styles.item}>
				<View style={styles.titleInfo}>
					<Iconfont name={'task'} size={18} color={Theme.primaryColor} />
					<Text style={styles.title}>出题任务</Text>
				</View>
				<View style={styles.bottomInfo}>
					<Text style={styles.text}>已被采纳</Text>
					<Text style={styles.infoItem}>奖励：{data.gold}智慧点 </Text>
					<Text style={styles.infoItem}>
						专题：{Tools.syncGetter('question.category.name', notification)}{' '}
					</Text>
					<Text style={styles.infoItem}>时间：{Tools.syncGetter('question.created_at', notification)}</Text>
					<Text style={[styles.infoItem, { lineHeight: 20 }]}>
						题目名：{Tools.syncGetter('question.description', notification)}
					</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	item: {
		marginTop: 20,
		marginBottom: 10,
		marginHorizontal: 15,
		backgroundColor: Theme.white
	},
	titleInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 13,
		marginHorizontal: 15,
		borderBottomWidth: 0.5,
		borderBottomColor: Theme.tintGray
	},
	title: {
		paddingLeft: 15,
		fontSize: 15,
		color: Theme.primaryFont
	},
	bottomInfo: {
		paddingVertical: 15,
		marginHorizontal: 15
	},
	text: {
		fontSize: 17,
		paddingBottom: 15,
		fontWeight: '500',
		color: Theme.weixin
	},
	infoItem: {
		fontSize: 14,
		color: Theme.grey,
		paddingVertical: 3
	},
	footer: {
		borderTopColor: Theme.lightBorder,
		borderTopWidth: 0.5,
		paddingVertical: 13,
		marginHorizontal: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
});

export default ContributeNotificationItem;
