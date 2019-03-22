/*
 * @flow
 * created by wyk made in 2019-03-22 11:55:07
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, ListItem, Avatar } from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from '../../utils';
import { connect } from 'react-redux';

import UserPanel from './components/UserPanel';

class AccountSecurity extends Component {
	render() {
		let { navigation } = this.props;
		let user = navigation.getParam('user', {});
		return (
			<PageContainer title="账号与安全" white>
				<View style={styles.container}>
					<View style={styles.userPanel}>
						<View style={styles.panelLeft}>
							<Avatar
								source={user.avatar}
								size={52}
								borderStyle={{ borderWidth: 1, borderColor: '#ffffff' }}
							/>
							<View style={styles.panelContent}>
								<Text style={{ color: Theme.defaultTextColor, fontSize: 15 }}>{user.name}</Text>
								<Text style={styles.userLevel}>
									LV.{user.level ? user.level.level : '1'} {'  '}
									{user.level.name} {'  '}
									{user.exp}/{user.next_level_exp}
								</Text>
							</View>
						</View>
					</View>
					<ListItem
						disabled
						style={styles.listItem}
						leftComponent={<Text style={styles.itemText}>账号信息</Text>}
						rightComponent={<Text style={styles.rightText}>{user.account}</Text>}
					/>
					<ListItem
						onPress={() => navigation.navigate('ModifyAliPay')}
						style={styles.listItem}
						leftComponent={<Text style={styles.itemText}>支付宝账号</Text>}
						rightComponent={
							user.pay_account ? (
								<Text style={styles.rightText}>{user.pay_account + '(' + user.real_name + ')'}</Text>
							) : (
								<View style={styles.rightWrap}>
									<Text style={styles.linkText}>去绑定</Text>
									<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
								</View>
							)
						}
					/>
					<ListItem
						onPress={() => navigation.navigate('ModifyPassword')}
						style={styles.listItem}
						leftComponent={<Text style={styles.itemText}>修改密码</Text>}
						rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
					/>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		marginHorizontal: PxFit(Theme.itemSpace)
	},
	userPanel: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: PxFit(80),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	panelLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	panelContent: {
		height: 34,
		justifyContent: 'space-between',
		marginLeft: 15
	},
	userLevel: {
		fontSize: 12,
		color: Theme.subTextColor,
		fontWeight: '300',
		paddingTop: 3
	},
	listItem: {
		height: PxFit(50),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	itemText: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		marginRight: PxFit(15)
	},
	rightText: {
		fontSize: PxFit(15),
		color: Theme.subTextColor
	},
	rightWrap: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	linkText: {
		fontSize: PxFit(15),
		color: '#407FCF',
		marginRight: PxFit(6)
	},
	avatarTip: {
		marginVertical: PxFit(15),
		fontSize: PxFit(13),
		color: Theme.subTextColor
	},
	fieldGroup: {
		marginBottom: PxFit(30),
		paddingHorizontal: Theme.itemSpace
	},
	field: {
		fontSize: PxFit(14),
		color: '#666'
	},
	inputWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	inputStyle: {
		flex: 1,
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		paddingVertical: PxFit(10),
		marginTop: PxFit(6)
	},
	genderGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		width: PxFit(100)
	},
	genderItem: { width: PxFit(20), height: PxFit(20), marginRight: PxFit(8) }
});

export default connect(store => ({ user: store.users.user }))(AccountSecurity);
