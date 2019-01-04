import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions, Slider } from 'react-native';

import { Header } from '../../components/Header';
import { TabTop, Banner, Avatar, DivisionLine } from '../../components/Universal';
import Screen from '../Screen';
import { Colors, Config, Divice } from '../../constants';
import { Iconfont } from '../../utils/Fonts';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

class WithdrawApplyScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation, user } = this.props;

		return (
			<Screen customStyle={{ backgroundColor: Colors.themeRed, borderBottomWidth: 0 }} routeName={'提现'}>
				<Image
					source={require('../../assets/images/money.png')}
					style={{ width: width, height: (width * 617) / 1080 }}
				/>
				<Text>提现申请已提交</Text>
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
