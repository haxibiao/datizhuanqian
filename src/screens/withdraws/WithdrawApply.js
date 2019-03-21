/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:45:50
 */

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Button, PageContainer } from '../../components';

import { Theme, SCREEN_WIDTH } from '../../constants';

class WithdrawApply extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation } = this.props;
		const { amount } = navigation.state.params;

		return (
			<PageContainer title="提现">
				<Image source={require('../../../assets/images/money.png')} style={styles.image} />
				<View style={styles.content}>
					<Text style={styles.header}>提现申请已提交</Text>
					<View style={styles.center}>
						<Text style={styles.money}>{amount}.00</Text>
						<Text style={{ fontSize: 15, color: Theme.themeRed, paddingTop: 32 }}> 元</Text>
					</View>
					<View style={styles.bottom}>
						<Text style={styles.text}>预计3~5个工作日内到账支付宝</Text>
						<Text style={styles.tips}>(如遇提现高峰，会延长到账时间，请耐心等待哦)</Text>
					</View>
					<Button
						title={'确定'}
						style={styles.button}
						onPress={() => {
							this.props.navigation.goBack();
						}}
					/>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	image: {
		width: SCREEN_WIDTH,
		height: (SCREEN_WIDTH * 617) / 1080
	},
	content: {
		alignItems: 'center',
		paddingHorizontal: 20
	},
	header: {
		fontSize: 22,
		color: Theme.black
	},
	center: {
		flexDirection: 'row',
		marginTop: 20
	},
	money: {
		fontSize: 50,
		color: Theme.themeRed
	},
	bottom: {
		alignItems: 'center',
		marginTop: 20
	},
	text: {
		fontSize: 15,
		color: Theme.black
	},
	tips: {
		fontSize: 14,
		color: Theme.grey,
		paddingTop: 10
	},
	button: {
		height: 38,
		borderRadius: 19,
		marginTop: 40,
		width: SCREEN_WIDTH - 60,
		backgroundColor: Theme.theme
	}
});

export default WithdrawApplyScreen;
