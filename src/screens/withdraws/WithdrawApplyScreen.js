import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Button, Screen } from '../../components';

import { Colors, Config, Divice } from '../../constants';

class WithdrawApplyScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation } = this.props;
		const { amount } = navigation.state.params;

		return (
			<Screen customStyle={{ backgroundColor: Colors.themeRed }} routeName={'提现'}>
				<Image source={require('../../../assets/images/money.png')} style={styles.image} />
				<View style={styles.content}>
					<Text style={styles.header}>提现申请已提交</Text>
					<View style={styles.center}>
						<Text style={styles.money}>{amount}.00</Text>
						<Text style={[styles.money, { paddingTop: 32 }]}> 元</Text>
					</View>
					<View style={styles.bottom}>
						<Text style={styles.text}>预计3~5个工作日内到账支付宝</Text>
						<Text style={styles.tips}>(如遇提现高峰，会延长到账时间，请耐心等待哦)</Text>
					</View>
					<Button
						name={'确定'}
						style={styles.button}
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
	image: {
		width: Divice.width,
		height: (Divice.width * 617) / 1080
	},
	content: {
		alignItems: 'center',
		paddingHorizontal: 20
	},
	header: {
		fontSize: 22,
		color: Colors.black
	},
	center: {
		flexDirection: 'row',
		marginTop: 20
	},
	money: {
		fontSize: 50,
		color: Colors.themeRed
	},
	bottom: {
		alignItems: 'center',
		marginTop: 20
	},
	text: {
		fontSize: 15,
		color: Colors.black
	},
	tips: {
		fontSize: 14,
		color: Colors.grey,
		paddingTop: 10
	},
	botton: {
		height: 38,
		borderRadius: 19,
		marginTop: 40,
		width: Divice.width - 60
	}
});

export default WithdrawApplyScreen;
