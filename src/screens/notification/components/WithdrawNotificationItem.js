/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:59:17
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Iconfont } from 'components';
import { Theme, PxFit, Tools } from 'utils';

class WithdrawNotificationItem extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, notification } = this.props;
		let withdraw = Tools.syncGetter('withdraw', notification);
		return (
			<TouchableOpacity
				style={styles.item}
				onPress={() => {
					navigation.navigate('BillingRecord');
				}}
			>
				<View style={styles.titleInfo}>
					<Iconfont name={'tixian'} size={20} color={Theme.primaryColor} />
					<Text style={styles.title}>提现通知</Text>
				</View>
				<View style={styles.bottomInfo}>
					<Text style={styles.text}>￥{Tools.syncGetter('amount', withdraw)}.00</Text>
					{notification.type == 'WITHDRAW_SUCCESS' ? (
						<View>
							<Text style={{ color: Theme.weixin, paddingVertical: 3 }}>提现成功</Text>
							<Text style={styles.infoItem}>
								提现方式：支付宝({Tools.syncGetter('to_account', withdraw)})
							</Text>
							<Text style={styles.infoItem}>到账时间：{Tools.syncGetter('updated_at', withdraw)}</Text>
						</View>
					) : (
						<View>
							<Text style={{ color: Theme.secondaryColor, paddingVertical: 3 }}>提现失败</Text>
							<Text style={styles.infoItem}>提现单号：{Tools.syncGetter('biz_no', withdraw)}</Text>
							<Text style={[styles.infoItem, { lineHeight: PxFit(20) }]}>
								回执信息：{Tools.syncGetter('remark', withdraw)}
							</Text>
						</View>
					)}
				</View>
				<TouchableOpacity
					style={styles.footer}
					onPress={() => {
						navigation.navigate('withdrawLogDetails', {
							withdraw_id: Tools.syncGetter('id', withdraw)
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
		marginTop: PxFit(20),
		marginBottom: PxFit(10),
		marginHorizontal: PxFit(15),
		backgroundColor: Theme.white
	},
	titleInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: PxFit(13),
		marginHorizontal: PxFit(15),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.tintGray
	},
	title: {
		paddingLeft: PxFit(15),
		fontSize: PxFit(15),
		color: Theme.primaryFont
	},
	bottomInfo: {
		paddingVertical: PxFit(15),
		marginHorizontal: PxFit(15)
	},
	text: {
		fontSize: PxFit(20),
		paddingBottom: PxFit(15),
		color: Theme.primaryFont,
		fontWeight: '500'
	},
	infoItem: {
		fontSize: 14,
		color: Theme.grey,
		paddingVertical: PxFit(3)
	},
	footer: {
		borderTopColor: Theme.lightBorder,
		borderTopWidth: PxFit(0.5),
		paddingVertical: PxFit(13),
		marginHorizontal: PxFit(15),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
});

export default WithdrawNotificationItem;
