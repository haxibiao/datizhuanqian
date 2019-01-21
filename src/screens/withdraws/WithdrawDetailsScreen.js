import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

import { TabTop, Banner, Avatar, DivisionLine, Header } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { connect } from 'react-redux';

class WithdrawDetailsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, user } = this.props;
		const { withdraws } = navigation.state.params;
		return (
			<View style={styles.container}>
				<Header />
				<View style={{ backgroundColor: Colors.white }}>
					<View style={{ paddingHorizontal: 15 }}>
						<View style={styles.header}>
							<Avatar size={38} uri={user.avatar} />
							<Text style={styles.name}>{user.name}</Text>
						</View>
						<View style={styles.info}>
							<Text style={styles.money}>{withdraws.amount}.00</Text>
							{withdraws.status == -1 ? (
								<Text style={{ fontSize: 16, color: Colors.themeRed }}>交易失败</Text>
							) : (
								<Text style={{ fontSize: 16, color: Colors.weixin }}>交易成功</Text>
							)}
						</View>
						<View style={styles.row}>
							<Text style={styles.textLeft}>提现单号</Text>
							<Text style={styles.textRight}>{withdraws.biz_no}</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.textLeft}>转账备注</Text>
							<Text style={styles.textRight}>智慧点提现</Text>
						</View>
						<View style={[styles.row, { paddingBottom: 15 }]}>
							<Text style={styles.textLeft}>收款账户</Text>
							<Text style={styles.textRight}>{user.pay_account + '(' + user.real_name + ')'}</Text>
						</View>
						<View style={styles.borderRow}>
							<Text style={styles.textLeft}>{withdraws.status == -1 ? '提现时间' : '到账时间'}</Text>
							<Text style={styles.textRight}>
								{withdraws.status == -1 ? withdraws.created_at : withdraws.updated_at}
							</Text>
						</View>
						<View style={[styles.row, { paddingBottom: 15 }]}>
							<Text style={styles.textLeft}>支付宝订单号</Text>
							<Text style={styles.text}>{withdraws.trade_no}</Text>
						</View>
					</View>
					<DivisionLine height={10} />
					<View style={{ paddingHorizontal: 15 }}>
						<View style={styles.footer}>
							<Text style={styles.textLeft}>回执信息</Text>
							<Text style={styles.textRight}>{withdraws.remark}</Text>
						</View>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBorder
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 15
	},

	name: {
		paddingLeft: 10,
		fontSize: 18,
		color: Colors.black
	},
	info: {
		alignItems: 'center',
		marginVertical: 20
	},
	money: {
		fontSize: 36,
		paddingBottom: 15,
		color: Colors.black
	},
	row: {
		paddingBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	textLeft: {
		fontSize: 15,
		color: Colors.grey
	},
	textRight: {
		fontSize: 15,
		color: Colors.black
	},
	text: {
		fontSize: 15,
		color: Colors.black,
		width: (Divice.width * 5) / 9,
		textAlign: 'right'
	},
	borderRow: {
		paddingBottom: 20,
		paddingTop: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: Colors.lightBorder
	},
	footer: {
		paddingVertical: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(WithdrawDetailsScreen);
