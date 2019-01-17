import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, ScrollView } from 'react-native';
import { Header, Button, PropDetailsModal, DivisionLine, ErrorBoundary, ContentEnd } from '../../components';

import { Colors, Config, Divice } from '../../constants';
import { Iconfont } from '../../utils/Fonts';

import { connect } from 'react-redux';

import Screen from '../Screen';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	_notificationItem = ({ item, index }) => {
		return (
			<View>
				<View style={styles.timeInfo}>
					<View style={styles.time}>
						<Text
							style={{
								color: Colors.white
							}}
						>
							{item.time_ago}
						</Text>
					</View>
				</View>
				{item.type == 1 && (
					<View style={styles.content}>
						<View style={styles.titleInfo}>
							<Iconfont name={'tixian'} size={20} color={Colors.theme} />
							<Text style={styles.title}>智慧点提现</Text>
						</View>
						<View style={styles.bottomInfo}>
							<Text style={{ fontSize: 22, paddingBottom: 15 }}>￥{item.transaction.amount}.00</Text>
							<Text style={styles.infoItem}>提现方式:支付宝({item.user.alipay})</Text>
							<Text style={styles.infoItem}>提现时间:{item.transaction.created_at}</Text>
							<Text style={styles.infoItem}>预计到账时间:1-3个工作日</Text>
						</View>
					</View>
				)}
				{item.type == 2 && (
					<View style={styles.content}>
						<View style={styles.titleInfo}>
							<Iconfont name={'like'} size={20} color={Colors.weixin} />
							<Text style={styles.title}>精力点变化</Text>
						</View>
						<View style={styles.bottomInfo}>
							<Text style={{ fontSize: 20, paddingBottom: 15 }}>您的精力点已经重置了哦</Text>
							<Text style={styles.infoItem}>
								当前精力点: {item.user.ticket}/{item.user.ticket}
							</Text>
							<Text style={styles.infoItem}>恢复时间: 每天00:00</Text>
						</View>
					</View>
					//精力点不足提醒
				)}
				{item.type == 3 && (
					<View style={styles.content}>
						<View style={styles.titleInfo}>
							<Iconfont name={'setting1'} size={20} color={Colors.red} />
							<Text style={styles.title}>升级通知</Text>
						</View>
						<View style={styles.bottomInfo}>
							<Text style={{ fontSize: 20, paddingBottom: 15 }}>恭喜你升级了！</Text>
							<Text style={styles.infoItem}>当前等级: LV{item.user.level.level} </Text>
							<Text style={styles.infoItem}>精力点上限: {item.user.ticket} </Text>
							<Text style={styles.infoItem}>距离下一级升级还需: {item.user.next_level_exp}经验 </Text>
						</View>
					</View>
				)}
			</View>
		);
	};
	render() {
		let { notification } = this.props;
		return (
			<Screen>
				<FlatList
					style={{ backgroundColor: Colors.lightBorder, marginBottom: 50 }}
					data={notification}
					keyExtractor={(item, index) => index.toString()}
					renderItem={this._notificationItem}
				/>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBorder
	},
	timeInfo: {
		alignItems: 'center',
		marginTop: 10
	},
	time: {
		backgroundColor: '#D8D8D8',
		paddingHorizontal: 7,
		paddingVertical: 3,
		borderRadius: 5
	},
	content: {
		marginTop: 20,
		marginBottom: 10,
		marginHorizontal: 15,
		backgroundColor: Colors.white
	},
	titleInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 15,
		marginHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.tintGray
	},
	title: {
		paddingLeft: 15,
		fontSize: 17
	},
	bottomInfo: {
		paddingVertical: 15,
		marginHorizontal: 15
	},
	infoItem: {
		fontSize: 15,
		color: Colors.grey,
		paddingVertical: 5
	}
});

export default connect(store => {
	return { notification: store.users.notification };
})(HomeScreen);
