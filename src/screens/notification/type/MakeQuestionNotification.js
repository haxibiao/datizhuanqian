import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Iconfont, UserTitle, Avatar } from '../../../components';
import { Colors } from '../../../constants';

class TaskNotification extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, notification } = this.props;
		return (
			<View style={styles.item}>
				<View style={styles.titleInfo}>
					<Iconfont name={'task'} size={18} color={Colors.theme} />
					<Text style={styles.title}>出题任务</Text>
				</View>
				<View style={styles.bottomInfo}>
					<Text style={styles.text}>已被采纳</Text>
					<Text style={styles.infoItem}>奖励：10智慧点 </Text>
					<Text style={styles.infoItem}>专题：{notification.question.category.name} </Text>
					<Text style={styles.infoItem}>时间：{notification.question.created_at}</Text>
					<Text style={[styles.infoItem, { lineHeight: 22 }]}>
						题目名：{notification.question.description}
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
		fontSize: 17,
		paddingBottom: 15,
		fontWeight: '500',
		color: Colors.weixin
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

export default TaskNotification;
