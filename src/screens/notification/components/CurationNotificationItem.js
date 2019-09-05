/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 14:02:08
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Iconfont } from 'components';
import { Theme, Tools } from 'utils';

class CurationNotificationItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, notification } = this.props;
		let type = Tools.syncGetter('curation.type', notification);
		return (
			<View style={styles.item}>
				<View style={styles.titleInfo}>
					<Iconfont name={'answer'} size={18} color={Theme.primaryColor} />
					<Text style={styles.title}>题目纠错</Text>
				</View>
				<View style={styles.bottomInfo}>
					<Text style={styles.text}>已被采纳</Text>
					<Text style={styles.infoItem}>
						奖励：{`${Tools.syncGetter('curation.gold_awarded', notification)}智慧点`}{' '}
					</Text>
					{type == 0 && <Text style={styles.infoItem}>类型：题干有误</Text>}
					{type == 1 && <Text style={styles.infoItem}>类型：答案有误</Text>}
					{type == 2 && <Text style={styles.infoItem}>类型：图片缺少或不清晰</Text>}
					{type == 3 && <Text style={styles.infoItem}>类型：其他</Text>}
					<Text style={styles.infoItem}>时间：{Tools.syncGetter('curation.created_at', notification)}</Text>
					<Text style={[styles.infoItem, { lineHeight: 22 }]}>
						题目名：{Tools.syncGetter('curation.question.description', notification)}
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
		color: Theme.weixin,
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

export default CurationNotificationItem;
