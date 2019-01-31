//TODO:通知待完善

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Button, Header, Screen, Iconfont, Avatar } from '../../components';
import { Colors, Config, Divice } from '../../constants';

class NotificationType extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { navigation, user, notification } = this.props;
		return (
			<View>
				{notification.type == 'WITHDRAW_SUCCESS' && (
					<View>
						<View style={styles.timeInfo}>
							<View style={styles.time}>
								<Text
									style={{
										color: Colors.white,
										fontSize: 12
									}}
								>
									{notification.created_at}
								</Text>
							</View>
						</View>
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
								<View>
									<Text style={{ color: Colors.weixin, paddingVertical: 3 }}>提现成功</Text>
									<Text style={styles.infoItem}>
										提现方式：支付宝({notification.withdraw.to_account})
									</Text>
									<Text style={styles.infoItem}>到账时间：{notification.withdraw.updated_at}</Text>
								</View>
							</View>
							<TouchableOpacity
								style={styles.footer}
								onPress={() => {
									navigation.navigate('提现详情', {
										withdraw_id: notification.withdraw.withdraw_id
									});
								}}
							>
								<Text>查看详情</Text>
								<Iconfont name={'right'} size={14} />
							</TouchableOpacity>
						</TouchableOpacity>
					</View>
				)}
				{notification.type == 'WITHDRAW_FAILURE' && (
					<View>
						<View style={styles.timeInfo}>
							<View style={styles.time}>
								<Text
									style={{
										color: Colors.white,
										fontSize: 12
									}}
								>
									{notification.created_at}
								</Text>
							</View>
						</View>
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
								<View>
									<Text style={{ color: Colors.themeRed, paddingVertical: 3 }}>提现失败</Text>
									<Text style={styles.infoItem}>提现单号：{notification.withdraw.biz_no}</Text>
									<Text style={styles.infoItem}>回执信息：{notification.withdraw.remark}</Text>
								</View>
							</View>
							<TouchableOpacity
								style={styles.footer}
								onPress={() => {
									navigation.navigate('提现详情', {
										withdraw_id: notification.withdraw.withdraw_id
									});
								}}
							>
								<Text>查看详情</Text>
								<Iconfont name={'right'} size={14} />
							</TouchableOpacity>
						</TouchableOpacity>
					</View>
				)}

				{notification.type == 'FEEDBACK_COMMENT' && (
					<TouchableOpacity
						style={{
							paddingVertical: 15,
							paddingHorizontal: 10,
							backgroundColor: Colors.white,
							borderBottomWidth: 0.5,
							borderBottomColor: Colors.lightBorder
						}}
					>
						<View style={styles.topLeft}>
							<Avatar uri={notification.comment.user.avatar} size={34} />
							<View style={styles.user}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Text
										style={{
											color: Colors.black
										}}
									>
										{notification.comment.user.name}
									</Text>
									{notification.comment.user.is_admin ? (
										<Image
											source={require('../../../assets/images/admin.png')}
											style={{ height: 13, width: 13, marginLeft: 5 }}
										/>
									) : (
										<View
											style={{
												backgroundColor: Colors.theme,
												paddingHorizontal: 2,
												marginLeft: 5,
												marginTop: 1,
												borderRadius: 1
											}}
										>
											<Text style={{ fontSize: 8, color: Colors.white }}>
												Lv.{notification.comment.user.level.level}
											</Text>
										</View>
									)}
								</View>

								<Text style={styles.commenTime}>{notification.comment.time_ago} 回复了我的反馈</Text>
							</View>
						</View>
						<View style={{ marginTop: 10, marginLeft: 44 }}>
							<Text style={{ color: Colors.black, fontSize: 15 }}>{notification.comment.content}</Text>
						</View>
						<View
							style={{ backgroundColor: Colors.lightBorder, padding: 6, marginTop: 10, marginLeft: 44 }}
						>
							<Text>{notification.comment.feedback.title}</Text>
						</View>
					</TouchableOpacity>
				)}

				{notification.type == 'REPLY_COMMENT' && (
					<TouchableOpacity
						style={{
							paddingVertical: 15,
							paddingHorizontal: 10,
							backgroundColor: Colors.white
						}}
					>
						<View style={styles.topLeft}>
							<Avatar uri={notification.comment.user.avatar} size={34} />
							<View style={styles.user}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Text
										style={{
											color: Colors.black
										}}
									>
										{notification.comment.user.name}
									</Text>
									{notification.comment.user.is_admin ? (
										<Image
											source={require('../../../assets/images/admin.png')}
											style={{ height: 13, width: 13, marginLeft: 5 }}
										/>
									) : (
										<View
											style={{
												backgroundColor: Colors.theme,
												paddingHorizontal: 2,
												marginLeft: 5,
												marginTop: 1,
												borderRadius: 1
											}}
										>
											<Text style={{ fontSize: 8, color: Colors.white }}>
												Lv.{notification.comment.user.level.level}
											</Text>
										</View>
									)}
								</View>

								<Text style={styles.commenTime}>{notification.comment.time_ago} 引用了我的评论</Text>
							</View>
						</View>
						<View style={{ marginTop: 10, marginLeft: 44 }}>
							<Text style={{ color: Colors.black, fontSize: 15 }}>{notification.comment.content}</Text>
						</View>
						<View
							style={{
								backgroundColor: Colors.lightBorder,
								padding: 6,
								marginTop: 10,
								marginLeft: 44
							}}
						>
							<Text>{notification.comment.feedback.title}</Text>
						</View>
					</TouchableOpacity>
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
					//精力点不足提醒
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
				)}
				{notification.type == 1001 && (
					<TouchableOpacity
						style={styles.item}
						onPress={() => {
							navigation.navigate('提现详情', {
								withdraws: {
									amount: 10
								}
							});
						}}
					>
						<View style={styles.titleInfo}>
							<Iconfont name={'tixian'} size={20} color={Colors.theme} />
							<Text style={styles.title}>智慧点提现</Text>
						</View>
						<View style={styles.bottomInfo}>
							<Text
								style={{
									fontSize: 20,
									paddingBottom: 15,
									color: Colors.primaryFont,
									fontWeight: '500'
								}}
							>
								￥{item.transaction.amount}.00
							</Text>
							<Text style={styles.infoItem}>提现方式:支付宝({item.user.alipay})</Text>
							<Text style={styles.infoItem}>提现时间:{item.transaction.created_at}</Text>
							<Text style={styles.infoItem}>预计到账时间:1-3个工作日</Text>
						</View>
					</TouchableOpacity>
				)}
				{notification.type == 'Task' && (
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
							<Iconfont name={'task'} size={18} color={Colors.theme} />
							<Text style={styles.title}>任务审核</Text>
						</View>
						<View style={styles.bottomInfo}>
							<Text
								style={{
									fontSize: 17,
									paddingBottom: 15,
									color: Colors.primaryFont,
									fontWeight: '500'
								}}
							>
								审核已通过
							</Text>
							<Text style={styles.infoItem}>任务名：小米应用商店评论 </Text>
							<Text style={styles.infoItem}>奖励：200智慧点 </Text>
							<Text style={styles.infoItem}>请到任务列表领取奖励 </Text>
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
	time: {
		backgroundColor: '#D8D8D8',
		paddingHorizontal: 5,
		paddingVertical: 1,
		borderRadius: 2
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
	},
	topLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	user: {
		paddingLeft: 10,
		justifyContent: 'space-between',
		height: 34
	},

	commenTime: {
		fontSize: 11,
		color: Colors.grey,
		lineHeight: 16
	}
});

export default NotificationType;
