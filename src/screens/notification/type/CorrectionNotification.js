import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Iconfont } from '../../../components';
import Colors from '../../../constants/Colors';

class RedDot extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, notification } = this.props;
		return (
			<View style={styles.item}>
				<View style={styles.titleInfo}>
					<Iconfont name={'answer'} size={18} color={Colors.theme} />
					<Text style={styles.title}>题目纠错</Text>
				</View>
				<View style={styles.bottomInfo}>
					<Text style={styles.text}>已被采纳</Text>
					<Text style={styles.infoItem}>奖励：{`${notification.question_redress.gold_awarded}智慧点`} </Text>
					{notification.question_redress.type == 0 && <Text style={styles.infoItem}>类型：题干有误</Text>}
					{notification.question_redress.type == 1 && <Text style={styles.infoItem}>类型：答案有误</Text>}
					{notification.question_redress.type == 2 && (
						<Text style={styles.infoItem}>类型：图片缺少或不清晰</Text>
					)}
					{notification.question_redress.type == 3 && <Text style={styles.infoItem}>类型：其他</Text>}
					<Text style={styles.infoItem}>时间：{notification.question_redress.created_at}</Text>
					<Text style={styles.infoItem}>题目名：{notification.question_redress.question.description}</Text>
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
		color: Colors.weixin,
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

export default RedDot;
