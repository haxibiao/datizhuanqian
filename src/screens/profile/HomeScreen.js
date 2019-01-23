import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Linking } from 'react-native';
import { DivisionLine, ErrorBoundary, Header, Screen, ProfileItem, ProfileNotLogin } from '../../components';
import { Colors, Config, Divice } from '../../constants';

import TopUserInfo from './user/TopUserInfo';

import { Storage, ItemKeys } from '../../store/localStorage';
import { connect } from 'react-redux';
import actions from '../../store/actions';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let { user, navigation, login } = this.props;

		return (
			<Screen header>
				<View style={styles.container}>
					<ScrollView bounces={false}>
						{login ? <TopUserInfo navigation={navigation} /> : <ProfileNotLogin navigation={navigation} />}

						<DivisionLine height={10} />
						{/*<ProfileItem
							name={'我的道具'}
							icon={'box'}
							size={19}
							right
							navigation={navigation}
							handler={() => (login ? navigation.navigate('我的道具') : navigation.navigate('登录注册'))}
						/>
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
							right
							navigation={navigation}
							handler={() =>
								login
									? navigation.navigate('提现日志', {
											user: user
									  })
									: navigation.navigate('登录注册')
							}
						/>
						<DivisionLine height={10} />
						<ProfileItem name={'常见问题'} icon={'question'} right navigation={navigation} />
						<ProfileItem
							name={'意见反馈'}
							icon={'feedback2'}
							right
							navigation={navigation}
							handler={() => (login ? navigation.navigate('意见反馈') : navigation.navigate('登录注册'))}
						/>
						<ProfileItem name={'商务合作'} icon={'book2'} size={19} right navigation={navigation} />
						<DivisionLine height={10} />
						<ProfileItem name={'设置'} icon={'setting1'} right navigation={navigation} />
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
