import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions, Slider } from 'react-native';

import { TabTop, Banner, Avatar, DivisionLine, Header, Button } from '../../components';
import Screen from '../Screen';
import { Colors, Config, Divice } from '../../constants';
import { Iconfont } from '../../utils/Fonts';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

const { width, height } = Dimensions.get('window');

// 退出账号 navigateAction
const navigateAction = NavigationActions.navigate({
	routeName: '主页',
	action: NavigationActions.navigate({ routeName: '我的' })
});

class WithdrawApplyScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, user } = this.props;
		const { amount } = navigation.state.params;

		return (
			<Screen customStyle={{ backgroundColor: Colors.themeRed, borderBottomWidth: 0 }} routeName={'提现'}>
				<Image
					source={require('../../../assets/images/money.png')}
					style={{ width: width, height: (width * 617) / 1080 }}
				/>
				<View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
					<Text style={{ fontSize: 22, color: Colors.black }}>提现申请已提交</Text>
					<View style={{ flexDirection: 'row', marginTop: 20 }}>
						<Text style={{ fontSize: 50, color: Colors.themeRed }}>{amount}.00</Text>
						<Text style={{ fontSize: 15, color: Colors.themeRed, paddingTop: 32 }}> 元</Text>
					</View>
					<View style={{ alignItems: 'center', marginTop: 20 }}>
						<Text style={{ fontSize: 15, color: Colors.black }}>预计3~5个工作日内到账支付宝</Text>
						<Text style={{ fontSize: 14, color: Colors.grey, paddingTop: 10 }}>
							(如遇提现高峰，会延长到账时间，请耐心等待哦)
						</Text>
					</View>
					<Button
						name={'确定'}
						style={{ height: 38, borderRadius: 19, marginTop: 40, width: width - 60 }}
						handler={() => {
							this.props.navigation.goBack();
						}}
						theme={Colors.themeRed}
						fontSize={14}
					/>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightBorder
	}
});

export default connect(store => {
	return {
		user: store.users.user
	};
})(WithdrawApplyScreen);
