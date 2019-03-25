/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:55:51
 */

//TODO:通知待完善

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Iconfont } from '../../../components';
import { Theme, PxFit } from '../../../utils';

import WithdrawNotificationItem from './WithdrawNotificationItem';
import ContributeNotificationItem from './ContributeNotificationItem';
import CurationNotificationItem from './CurationNotificationItem';

class NotificationItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation, user, notification } = this.props;
		return (
			<View>
				<View style={styles.timeInfo}>
					<View style={styles.timeBgc}>
						<Text style={styles.timeText}>{notification.created_at}</Text>
					</View>
				</View>
				{notification.withdraw && (
					<WithdrawNotificationItem notification={notification} navigation={navigation} />
					//提现
				)}
				{notification.type == 'QUESTION_AUDIT' && (
					<ContributeNotificationItem notification={notification} navigation={navigation} />
					//任务
				)}
				{notification.curation && (
					<CurationNotificationItem notification={notification} navigation={navigation} />
					//纠错
				)}

				{notification.type == 2 && (
					<View style={styles.item}>
						<View style={styles.titleInfo}>
							<Iconfont name={'like'} size={20} color={Theme.weixin} />
							<Text style={styles.title}>精力点变化</Text>
						</View>
						<View style={styles.bottomInfo}>
							<Text style={styles.text}>您的精力点已经重置了哦</Text>
							<Text style={styles.infoItem}>
								当前精力点: {item.user.ticket}/{item.user.ticket}
							</Text>
							<Text style={styles.infoItem}>恢复时间: 每天00:00</Text>
						</View>
					</View>
					//精力点恢复
				)}
				{notification.type == 3 && (
					<View style={styles.item}>
						<View style={styles.titleInfo}>
							<Iconfont name={'rank-up'} size={20} color={Theme.red} />
							<Text style={styles.title}>升级通知</Text>
						</View>
						<View style={styles.bottomInfo}>
							<Text style={styles.text}>恭喜你升级了！</Text>
							<Text style={styles.infoItem}>当前等级: LV{item.user.level.level} </Text>
							<Text style={styles.infoItem}>精力点上限: {item.user.ticket} </Text>
							<Text style={styles.infoItem}>距离下一级升级还需: {item.user.next_level_exp}经验 </Text>
						</View>
					</View>
					//升级
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	timeInfo: {
		alignItems: 'center',
		marginTop: 10
	},
	timeBgc: {
		backgroundColor: '#D8D8D8',
		paddingHorizontal: 5,
		paddingVertical: 1,
		borderRadius: 2
	},
	timeText: {
		color: Theme.white,
		fontSize: 12
	},
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
		fontSize: 20,
		paddingBottom: 15,
		color: Theme.primaryFont,
		fontWeight: '500'
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

export default NotificationItem;
