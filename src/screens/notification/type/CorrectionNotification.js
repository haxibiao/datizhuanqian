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
					navigation.dispatch(
						Methods.navigationAction({
							routeName: '主页',
							action: Methods.navigationAction({ routeName: '我的' })
						})
					);
				}}
			>
				<View style={styles.titleInfo}>
					<Iconfont name={'answer'} size={18} color={Colors.theme} />
					<Text style={styles.title}>题目纠错</Text>
				</View>
				<View style={styles.bottomInfo}>
					<Text style={styles.text}>纠错成功</Text>
					<Text style={styles.infoItem}>奖励：20智慧点 </Text>
					<Text style={styles.infoItem}>题目名：小米应用商店评论 </Text>
					<Text style={styles.infoItem}>提交时间：2019-02-11 16:40 </Text>
				</View>
				<TouchableOpacity
					style={styles.footer}
					onPress={() => {
						navigation.navigate('提现详情', {
							withdraws: {
								amount: 10
							}
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
		fontSize: 17,
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
