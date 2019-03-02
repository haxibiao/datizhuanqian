//TODO:通知待完善

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Button, Header, Screen, Iconfont, Avatar } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import WithdrawNotification from './type/WithdrawNotification';
import MakeQuestionNotification from './type/MakeQuestionNotification';
import CorrectionNotification from './type/CorrectionNotification';

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
					<WithdrawNotification notification={notification} navigation={navigation} />
					//提现
				)}
				{notification.type == 'QUESTION_AUDIT' && (
					<MakeQuestionNotification notification={notification} navigation={navigation} />
					//任务
				)}
				{notification.question_redress && (
					<CorrectionNotification notification={notification} navigation={navigation} />
					//纠错
				)}

				{notification.type == 2 && (
					<View style={styles.item}>
						<View style={styles.titleInfo}>
							<Iconfont name={'like'} size={20} color={Colors.weixin} />
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
							<Iconfont name={'rank-up'} size={20} color={Colors.red} />
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
		color: Colors.white,
		fontSize: 12
	},
	item: {
		marginTop: 20,
		marginBottom: 10,
		marginHorizontal: 15,
		backgroundColor: Colors.white
	},
	titleInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 13,
		marginHorizontal: 15,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.tintGray
	},
	title: {
		paddingLeft: 15,
		fontSize: 15,
		color: Colors.primaryFont
	},
	bottomInfo: {
		paddingVertical: 15,
		marginHorizontal: 15
	},
	text: {
		fontSize: 20,
		paddingBottom: 15,
		color: Colors.primaryFont,
		fontWeight: '500'
	},
	infoItem: {
		fontSize: 14,
		color: Colors.grey,
		paddingVertical: 3
	},
	footer: {
		borderTopColor: Colors.lightBorder,
		borderTopWidth: 0.5,
		paddingVertical: 13,
		marginHorizontal: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
});

export default NotificationItem;
