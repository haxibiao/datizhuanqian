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
			<TouchableOpacity
				style={styles.item}
				onPress={() => {
					navigation.navigate('提现日志');
				}}
			>
				<View style={styles.titleInfo}>
					<Iconfont name={'tixian'} size={20} color={Colors.theme} />
					<Text style={styles.title}>提现通知</Text>
				</View>
				<View style={styles.bottomInfo}>
					<Text style={styles.text}>￥{notification.withdraw.amount}.00</Text>
					{notification.type == 'WITHDRAW_SUCCESS' ? (
						<View>
							<Text style={{ color: Colors.weixin, paddingVertical: 3 }}>提现成功</Text>
							<Text style={styles.infoItem}>提现方式：支付宝({notification.withdraw.to_account})</Text>
							<Text style={styles.infoItem}>到账时间：{notification.withdraw.updated_at}</Text>
						</View>
					) : (
						<View>
							<Text style={{ color: Colors.themeRed, paddingVertical: 3 }}>提现失败</Text>
							<Text style={styles.infoItem}>提现单号：{notification.withdraw.biz_no}</Text>
							<Text style={styles.infoItem}>回执信息：{notification.withdraw.remark}</Text>
						</View>
					)}
				</View>
				<TouchableOpacity
					style={styles.footer}
					onPress={() => {
						navigation.navigate('提现详情', {
							withdraw_id: notification.withdraw.id
						});
					}}
				>
					<Text>查看详情</Text>
					<Iconfont name={'right'} size={14} />
				</TouchableOpacity>
			</TouchableOpacity>
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

export default RedDot;
