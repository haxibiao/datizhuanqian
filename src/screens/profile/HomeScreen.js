import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Linking, Image } from 'react-native';
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

import ProfileColumnItem from './components/ProfileColumnItem';

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
					{login ? <TopUserInfo navigation={navigation} /> : <ProfileNotLogin navigation={navigation} />}
					<ScrollView bounces={false}>
						<DivisionLine height={10} />
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<ProfileColumnItem
								title={'我的收藏'}
								path={require('../../../assets/images/favorites.png')}
								handler={() =>
									login ? navigation.navigate('我的收藏') : navigation.navigate('登录注册')
								}
							/>
							<ProfileColumnItem
								title={'我的出题'}
								path={require('../../../assets/images/question-log.png')}
								handler={() =>
									login ? navigation.navigate('我的出题') : navigation.navigate('登录注册')
								}
							/>
							<ProfileColumnItem
								title={'答题记录'}
								path={require('../../../assets/images/answer-log.png')}
								handler={() =>
									login ? navigation.navigate('我的出题') : navigation.navigate('登录注册')
								}
							/>
							<ProfileColumnItem
								title={'纠题记录'}
								path={require('../../../assets/images/curation.png')}
								handler={() =>
									login ? navigation.navigate('纠题记录') : navigation.navigate('登录注册')
								}
							/>
						</View>
						<DivisionLine height={10} />
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
						<ProfileItem
							name={'提现日志'}
							icon={'book'}
							IconStyle={{ paddingBottom: 3 }}
							navigation={navigation}
							handler={() => (login ? navigation.navigate('提现日志') : navigation.navigate('登录注册'))}
						/>
						<DivisionLine height={10} />
						<ProfileItem
							name={'反馈中心'}
							icon={'feedback2'}
							navigation={navigation}
							handler={() => (login ? navigation.navigate('意见反馈') : navigation.navigate('登录注册'))}
						/>
						<ProfileItem name={'常见问题'} icon={'question'} navigation={navigation} />
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
