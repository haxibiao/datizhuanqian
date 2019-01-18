import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Linking } from 'react-native';
import { DivisionLine, ErrorBoundary, Header, Screen } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Iconfont } from '../../utils/Fonts';

import TopUserInfo from './user/TopUserInfo';

import { Storage, ItemKeys } from '../../store/localStorage';
import { connect } from 'react-redux';
import actions from '../../store/actions';

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userCache: ''
		};
	}

	openUrl(url) {
		console.log('uri', url);
		Linking.openURL('https://www.baidu.com/');
	}
	async componentWillMount() {
		this.setState({
			userCache: await Storage.getItem(ItemKeys.userCache)
		});
	}
	render() {
		let { user, navigation, login } = this.props;

		return (
			<Screen header>
				<View style={styles.container}>
					<ScrollView bounces={false}>
						<TopUserInfo navigation={navigation} userCache={this.state.userCache} />

						<DivisionLine height={10} />
						{/*<TouchableOpacity
							style={styles.rowItem}
							onPress={() => {
								navigation.navigate("我的道具");
							}}
						>
							<View style={styles.itemLeft}>
								<Iconfont name={"box"} size={19} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black, fontSize: 15 }}>
									我的道具
								</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
						<TouchableOpacity style={styles.rowItem} onPress={() => this.openUrl()}>
							<View style={styles.itemLeft}>
								<Iconfont name={"invitation"} size={19} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black, fontSize: 15 }}>
									分享邀请
								</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>
						<TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate("出题")}>
							<View style={styles.itemLeft}>
								<Iconfont name={"book2"} size={19} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black, fontSize: 15 }}>
									我要出题
								</Text>
							</View>
							<Iconfont name={"right"} />
						</TouchableOpacity>*/}
						<TouchableOpacity
							style={styles.rowItem}
							onPress={() =>
								login
									? navigation.navigate('提现日志', {
											user: user
									  })
									: navigation.navigate('登录注册')
							}
						>
							<View style={styles.itemLeft}>
								<Iconfont name={'book'} size={18} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black }}>提现日志</Text>
							</View>
							<Iconfont name={'right'} />
						</TouchableOpacity>
						<DivisionLine height={10} />
						<TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('常见问题')}>
							<View style={styles.itemLeft}>
								<Iconfont name={'question'} size={18} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black }}>常见问题</Text>
							</View>
							<Iconfont name={'right'} />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.rowItem}
							onPress={() => (login ? navigation.navigate('问题反馈') : navigation.navigate('登录注册'))}
						>
							<View style={styles.itemLeft}>
								<Iconfont name={'feedback2'} size={18} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black }}>意见反馈</Text>
							</View>
							<Iconfont name={'right'} />
						</TouchableOpacity>
						<DivisionLine height={10} />
						<TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate('设置')}>
							<View style={styles.itemLeft}>
								<Iconfont name={'setting1'} size={18} />
								<Text style={{ paddingLeft: 10, fontSize: 15, color: Colors.black }}>设置</Text>
							</View>
							<Iconfont name={'right'} />
						</TouchableOpacity>
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
	},
	rowItem: {
		height: 58,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder
	},
	itemLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

export default connect(store => {
	return { user: store.users.user, login: store.users.login };
})(HomeScreen);
