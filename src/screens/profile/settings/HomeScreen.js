import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions, Linking } from 'react-native';

import Screen from '../../Screen';
import { Colors, Methods, Config } from '../../../constants';
import { Iconfont } from '../../../utils/Fonts';

import { SignOutModal, CheckUpdateModal, Header, Avatar, DivisionLine } from '../../../components';
import SettingItem from './SettingItem';
import SeetingPageUser from '../user/SeetingPageUser';

import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import actions from '../../../store/actions';
import { Storage } from '../../../store/localStorage';

import codePush from 'react-native-code-push';

const { width, height } = Dimensions.get('window');

const navigateAction = NavigationActions.navigate({
	routeName: '主页',
	params: { resetStore: () => this.props.client.resetStore() },
	action: NavigationActions.navigate({ routeName: '我的' })
});

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.handleSignOutVisible = this.handleSignOutVisible.bind(this);
		this.handlePromotModalVisible = this.handlePromotModalVisible.bind(this);
		this.state = {
			signOutModalVisible: false,
			promotModalVisible: false,
			fontModalVisible: false,
			checkedWordSize: 1,
			storageSize: '1MB'
		};
	}

	render() {
		let {
			promotModalVisible,
			signOutModalVisible,
			fontModalVisible,
			storageSize,
			wordSize,
			checkedWordSize
		} = this.state;
		const { navigation, users, client } = this.props;
		const { login } = users;
		const { id } = users.user;
		return (
			<Screen customStyle={{ borderBottomColor: 'transparent' }}>
				<View style={styles.container}>
					<DivisionLine height={10} />
					<ScrollView style={styles.container} bounces={false} removeClippedSubviews={true}>
						{login ? <SeetingPageUser navigation={navigation} id={id} /> : null}

						<TouchableOpacity onPress={() => navigation.navigate('关于答题赚钱')}>
							<SettingItem itemName="关于答题赚钱" />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigation.navigate('等级说明')}>
							<SettingItem itemName="等级说明" />
						</TouchableOpacity>
						{/*<TouchableOpacity onPress={() => navigation.navigate("用户协议")}>
							<SettingItem itemName="用户协议" />
						</TouchableOpacity>*/}
						<TouchableOpacity onPress={() => navigation.navigate('分享给好友')}>
							<SettingItem itemName="分享给好友" endItem />
						</TouchableOpacity>
						<DivisionLine height={10} />
						<TouchableOpacity
							onPress={() => {
								this.clearCache();
							}}
						>
							<SettingItem rightSize={15} itemName="清除缓存" rightContent={storageSize} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								Methods.achieveUpdate(this.handlePromotModalVisible);
							}}
						>
							{
								//初步先用简单的判断版本号大小  外链到官网的下载地址，手动下载更新
								//TODO:后期需要整合原生模块,在APP内部下载自动安装。
							}

							<SettingItem rightSize={15} itemName="检查更新" rightContent={Config.AppVersion} endItem />
						</TouchableOpacity>
						<DivisionLine height={10} />
						{login && (
							<View>
								<TouchableOpacity
									onPress={() => {
										this.handleSignOutVisible();
									}}
									style={styles.loginOut}
								>
									<Text
										style={{
											fontSize: 17,
											color: Colors.theme
										}}
									>
										退出登录
									</Text>
								</TouchableOpacity>
								<DivisionLine height={15} />
							</View>
						)}
					</ScrollView>
				</View>
				<SignOutModal
					visible={signOutModalVisible}
					handleVisible={this.handleSignOutVisible}
					confirm={() => {
						this.props.dispatch(actions.signOut());
						this.props.navigation.dispatch(navigateAction);
						this.handleSignOutVisible();
					}}
				/>
				<CheckUpdateModal
					visible={promotModalVisible}
					cancel={this.handlePromotModalVisible}
					confirm={() => {
						this.handlePromotModalVisible();
						this.openUrl('https://datizhuanqian.com/storage/apks/datizhuanqian.apk');
					}}
					tips={'发现新版本'}
				/>
			</Screen>
		);
	}

	handleSignOutVisible() {
		this.setState(prevState => ({
			signOutModalVisible: !prevState.signOutModalVisible
		}));
	}
	handlePromotModalVisible() {
		this.setState(prevState => ({
			promotModalVisible: !prevState.promotModalVisible
		}));
	}

	openUrl(url) {
		console.log('uri', url);
		Linking.openURL(url);
	}

	clearCache = () => {
		this.setState({ storageSize: '0MB' });
		Methods.toast('清楚缓存成功', -200);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	settingItemContent: {
		fontSize: 17,
		color: Colors.tintFont
	},
	settingItemName: {
		fontSize: 17,
		color: Colors.primaryFont,
		paddingRight: 10,
		paddingBottom: 5
	},
	loginOut: {
		paddingHorizontal: 15,
		paddingVertical: 15,
		alignItems: 'center'
	},
	fontSetting: {
		paddingVertical: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	wordSize: {
		fontSize: 17,
		color: Colors.primaryFont
	},
	wordSizeModalFooter: {
		marginTop: 20,
		marginHorizontal: -20,
		borderTopWidth: 1,
		borderTopColor: Colors.lightBorder,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	fontOperation: {
		paddingVertical: 15,
		paddingHorizontal: 20
	}
});

export default connect(store => {
	return { users: store.users };
})(HomeScreen);
