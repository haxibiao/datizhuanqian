/*
 * @flow
 * created by wyk made in 2019-03-21 09:43:37
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Switch } from 'react-native';
import {
	PageContainer,
	TouchFeedback,
	Iconfont,
	Row,
	ListItem,
	CustomSwitch,
	ItemSeparator,
	PopOverlay
} from '../../components';
import { Theme, PxFit, Config } from '../../utils';
import actions from '../../store/actions';
import { connect } from 'react-redux';
import { Query, compose, withApollo, graphql, Mutation } from 'react-apollo';

import UserPanel from './components/UserPanel';

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			storageSize: (Math.random(1, 10) * 10).toFixed(1) + 'M'
		};
	}

	componentWillUnmount() {}

	checkVersion = () => {};

	render() {
		let { navigation, login, dispatch, client } = this.props;
		let { storageSize } = this.state;
		let user = navigation.getParam('user', {});
		return (
			<PageContainer title="设置" white>
				<ScrollView
					style={styles.container}
					contentContainerStyle={{ paddingBottom: PxFit(20) }}
					bounces={false}
					removeClippedSubviews={true}
					showsVerticalScrollIndicator={false}
				>
					{login ? <UserPanel navigation={navigation} user={user} /> : null}
					<ListItem
						onPress={() => navigation.navigate('GradeDescription')}
						style={styles.listItem}
						leftComponent={<Text style={styles.itemText}>等级说明</Text>}
						rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
					/>
					<ItemSeparator />
					<ListItem
						onPress={() => navigation.navigate('UserProtocol')}
						style={styles.listItem}
						leftComponent={<Text style={styles.itemText}>用户协议</Text>}
						rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
					/>
					<ItemSeparator />
					<ListItem
						onPress={() => navigation.navigate('ShareApp')}
						style={styles.listItem}
						leftComponent={<Text style={styles.itemText}>分享给好友</Text>}
						rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
					/>
					<ItemSeparator />
					<ListItem
						onPress={() => navigation.navigate('AboutUs')}
						style={styles.listItem}
						leftComponent={<Text style={styles.itemText}>关于答题赚钱</Text>}
						rightComponent={<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />}
					/>
					<ItemSeparator />
					<ListItem
						onPress={() =>
							setTimeout(() => {
								this.setState({ storageSize: '0M' }, () => {
									Toast.show({ content: '已清除缓存' });
								});
							}, 300)
						}
						style={styles.listItem}
						leftComponent={<Text style={styles.itemText}>清除缓存</Text>}
						rightComponent={<Text style={styles.rigthText}>{storageSize}</Text>}
					/>
					<ItemSeparator />
					<ListItem
						onPress={this.checkVersion}
						style={styles.listItem}
						leftComponent={<Text style={styles.itemText}>检查更新</Text>}
						rightComponent={<Text style={styles.rigthText}>{Config.AppVersion}</Text>}
					/>
					<ItemSeparator />
					{login && (
						<TouchFeedback
							style={[styles.listItem, { justifyContent: 'center' }]}
							onPress={() =>
								PopOverlay({
									content: '确定退出登录吗?',
									onConfirm: async () => {
										await dispatch(actions.signOut());
										await client.resetStore();
										// await client.clearStore();
										// client.cache.reset();
										navigation.navigate('Main', null, navigation.navigate({ routeName: '答题' }));
									}
								})
							}
						>
							<Text style={styles.logout}>退出登录</Text>
						</TouchFeedback>
					)}
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.groundColour
	},
	itemText: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		marginRight: PxFit(15)
	},
	rigthText: {
		fontSize: PxFit(14),
		color: Theme.subTextColor
	},
	listItem: {
		paddingHorizontal: PxFit(16),
		height: PxFit(50),
		backgroundColor: '#fff'
	},
	logout: {
		fontSize: PxFit(14),
		color: Theme.primaryColor,
		alignSelf: 'center'
	}
});

export default connect(store => ({ login: store.users.login }))(withApollo(index));
