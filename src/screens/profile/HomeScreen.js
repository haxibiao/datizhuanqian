import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Linking } from 'react-native';
import {
	DivisionLine,
	ErrorBoundary,
	Header,
	Screen,
	ProfileItem,
	ProfileNotLogin,
	Iconfont,
	RedDot
} from '../../components';
import { Colors, Config, Divice } from '../../constants';

import TopUserInfo from './user/TopUserInfo';

import { Storage, ItemKeys } from '../../store/localStorage';
import { connect } from 'react-redux';
import actions from '../../store/actions';

import { userUnreadQuery } from '../../graphql/notification.graphql';
import { Query } from 'react-apollo';

import { NativeModules } from 'react-native';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = { status: 1 };
	}

	render() {
		let { user, navigation, login } = this.props;

		return (
			<Screen header>
				<View style={styles.container}>
					<ScrollView bounces={false}>
						{login ? <TopUserInfo navigation={navigation} /> : <ProfileNotLogin navigation={navigation} />}

						<DivisionLine height={10} />

						{/*
						<ProfileItem
							name={'分享邀请'}
							icon={'invitation'}
							size={19}
							right
							navigation={navigation}
							handler={() => (login ? this.openUrl() : navigation.navigate('登录注册'))}
						/>
						<ProfileItem
							name={'我要出题'}
							icon={'book2'}
							size={19}
							right
							navigation={navigation}
							handler={() => (login ? navigation.navigate('我要出题') : navigation.navigate('登录注册'))}
						/>*/}
						<ProfileItem
							name={'提现日志'}
							icon={'book'}
							IconStyle={{ paddingBottom: 3 }}
							navigation={navigation}
							handler={() => (login ? navigation.navigate('提现日志') : navigation.navigate('登录注册'))}
						/>
						<ProfileItem
							name={'答题记录'}
							icon={'answerLog'}
							size={20}
							navigation={navigation}
							handler={() => (login ? navigation.navigate('答题记录') : navigation.navigate('登录注册'))}
						/>
						<ProfileItem
							name={'纠错记录'}
							icon={'correction'}
							size={18}
							navigation={navigation}
							handler={() => (login ? navigation.navigate('纠错记录') : navigation.navigate('登录注册'))}
						/>
						<ProfileItem
							name={'我的出题'}
							icon={'task3'}
							IconStyle={{ paddingBottom: 3 }}
							size={18}
							navigation={navigation}
							handler={() => (login ? navigation.navigate('出题记录') : navigation.navigate('登录注册'))}
						/>
						<ProfileItem
							name={'通知消息'}
							icon={'message'}
							IconStyle={{ paddingBottom: 3 }}
							size={17}
							right={
								login ? (
									<Query query={userUnreadQuery} variables={{ id: user.id }}>
										{({ data, error, refetch }) => {
											navigation.addListener('didFocus', payload => {
												refetch();
											});
											if (error) return null;
											if (!(data && data.user)) return null;
											if (data.user.unread_notifications_count) {
												return <RedDot count={data.user.unread_notifications_count} />;
											} else {
												return <Iconfont name={'right'} size={15} />;
											}
										}}
									</Query>
								) : (
									<Iconfont name={'right'} size={15} />
								)
							}
							navigation={navigation}
							handler={() => (login ? navigation.navigate('通知') : navigation.navigate('登录注册'))}
						/>
						{/*<ProfileItem
							name={'测试下载APK'}
							icon={'task2'}
							right
							navigation={navigation}
							handler={() => {
								NativeModules.DownloadApk.downloading(
									'http://cos.datizhuanqian.cn/apks/datizhuanqian.apk',
									'datizhuanqian.apk'
								);
							}}
						/>*/}
						<DivisionLine height={10} />
						<ProfileItem name={'常见问题'} icon={'question'} navigation={navigation} />
						<ProfileItem
							name={'反馈中心'}
							icon={'feedback2'}
							navigation={navigation}
							handler={() => (login ? navigation.navigate('意见反馈') : navigation.navigate('登录注册'))}
						/>
						{/*
						<ProfileItem name={'商务合作'} icon={'business'} size={20} right navigation={navigation} />*/}
						<DivisionLine height={10} />
						<ProfileItem name={'设置'} icon={'setting1'} navigation={navigation} />
					</ScrollView>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default connect(store => {
	return { user: store.users.user, login: store.users.login };
})(HomeScreen);
