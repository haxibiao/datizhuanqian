/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:48:46
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

import { Avatar, PageContainer } from '../../components';
import { Theme, SCREEN_WIDTH } from '../../utils';
import { connect } from 'react-redux';

import { WithdrawQuery } from '../../assets/graphql/withdraws.graphql';
import { Query } from 'react-apollo';

class WithdrawLogDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, user } = this.props;
		const { withdraw_id } = navigation.state.params;
		console.log('user', user);
		return (
			<PageContainer style={styles.container} title="提现详情">
				<Query query={WithdrawQuery} variables={{ id: withdraw_id }}>
					{({ data, error, loading }) => {
						if (error) return null;
						if (!(data && data.withdraw)) return null;
						let withdraw = data.withdraw;

						return (
							<View style={{ backgroundColor: Theme.white }}>
								<View style={{ paddingHorizontal: 15 }}>
									<View style={styles.header}>
										<Avatar size={38} source={{ uri: user.avatar }} />
										<Text style={styles.name}>{user.name}</Text>
									</View>
									<View style={styles.info}>
										<Text style={styles.money}>{withdraw.amount}.00</Text>
										{withdraw.status == -1 ? (
											<Text style={{ fontSize: 16, color: Theme.themeRed }}>交易失败</Text>
										) : (
											<Text style={{ fontSize: 16, color: Theme.weixin }}>交易成功</Text>
										)}
									</View>
									<View style={styles.row}>
										<Text style={styles.textLeft}>提现单号</Text>
										<Text style={styles.textRight}>{withdraw.biz_no}</Text>
									</View>
									<View style={styles.row}>
										<Text style={styles.textLeft}>转账备注</Text>
										<Text style={styles.textRight}>智慧点提现</Text>
									</View>
									<View style={[styles.row, { paddingBottom: 15 }]}>
										<Text style={styles.textLeft}>收款账户</Text>
										<Text style={styles.textRight}>
											{user.pay_account + '(' + user.real_name + ')'}
										</Text>
									</View>
									<View style={styles.borderRow}>
										<Text style={styles.textLeft}>
											{withdraw.status == -1 ? '提现时间' : '到账时间'}
										</Text>
										<Text style={styles.textRight}>
											{withdraw.status == -1 ? withdraw.created_at : withdraw.updated_at}
										</Text>
									</View>
									<View style={[styles.row, { paddingBottom: 15 }]}>
										<Text style={styles.textLeft}>支付宝订单号</Text>
										<Text style={styles.text}>{withdraw.trade_no}</Text>
									</View>
								</View>
								<View
									style={{
										paddingHorizontal: 15,
										borderTopWidth: 10,
										borderTopColor: Theme.lightBorder
									}}
								>
									<View style={styles.footer}>
										<Text style={styles.textLeft}>回执信息</Text>
										<Text style={styles.textRight}>{withdraw.remark}</Text>
									</View>
								</View>
							</View>
						);
					}}
				</Query>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.lightBorder
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
		color: Theme.black
	},
	info: {
		alignItems: 'center',
		marginVertical: 20
	},
	money: {
		fontSize: 36,
		paddingBottom: 15,
		color: Theme.black
	},
	row: {
		paddingBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	textLeft: {
		fontSize: 15,
		color: Theme.grey
	},
	textRight: {
		fontSize: 15,
		color: Theme.black
	},
	text: {
		fontSize: 15,
		color: Theme.black,
		width: (SCREEN_WIDTH * 5) / 9,
		textAlign: 'right'
	},
	borderRow: {
		paddingBottom: 20,
		paddingTop: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: Theme.lightBorder
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
})(WithdrawLogDetails);
