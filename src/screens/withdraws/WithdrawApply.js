/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 13:45:50
 */

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Button, PageContainer } from '../../components';

import { Theme, SCREEN_WIDTH, PxFit } from '../../constants';

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
						<Text style={{ fontSize: PxFit(15), color: Theme.themeRed, paddingTop: PxFit(32) }}> 元</Text>
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
		height: (SCREEN_WIDTH * PxFit(617)) / PxFit(1080)
	},
	content: {
		alignItems: 'center',
		paddingHorizontal: PxFit(20)
	},
	header: {
		fontSize: PxFit(22),
		color: Theme.black
	},
	center: {
		flexDirection: 'row',
		marginTop: PxFit(20)
	},
	money: {
		fontSize: PxFit(50),
		color: Theme.themeRed
	},
	bottom: {
		alignItems: 'center',
		marginTop: PxFit(20)
	},
	text: {
		fontSize: PxFit(15),
		color: Theme.black
	},
	tips: {
		fontSize: PxFit(14),
		color: Theme.grey,
		paddingTop: PxFit(10)
	},
	button: {
		height: PxFit(38),
		borderRadius: PxFit(19),
		marginTop: PxFit(40),
		width: SCREEN_WIDTH - PxFit(60),
		backgroundColor: Theme.theme
	}
});

export default WithdrawApplyScreen;
