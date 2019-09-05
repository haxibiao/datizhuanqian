/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 10:37:53
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions, Slider } from 'react-native';

// import { DivisionLine, WithdrawsTips } from '../Universal';
import { Theme, SCREEN_WIDTH, PxFit } from '../../../utils';

class NotLogin extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation } = this.props;

		return (
			<View style={styles.container}>
				<View style={styles.statistics}>
					<View style={styles.currentGold}>
						<Text style={styles.greyText1}>当前智慧点(个)</Text>
						<Text style={styles.boldBlackText}>0</Text>
					</View>
					<View style={styles.accumulat}>
						<View style={styles.accumulated}>
							<Text style={styles.greyText2}>今日可提现次数</Text>
							<Text style={styles.slenderBlackText}>0/ 0</Text>
						</View>
						<View style={styles.line} />
						<View style={styles.accumulated}>
							<Text style={styles.greyText2}>当前汇率(智慧点/元)</Text>
							<Text style={styles.slenderBlackText}>600/1</Text>
						</View>
					</View>
				</View>
				<View style={styles.withdraws}>
					<View style={styles.center}>
						<TouchableOpacity
							style={styles.withdrawItem}
							onPress={() => {
								navigation.navigate('Login');
							}}
						>
							<Text style={styles.content}>提现1元</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.withdrawItem}
							onPress={() => {
								navigation.navigate('Login');
							}}
						>
							<Text style={styles.content}>提现2元</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.withdrawItem}
							onPress={() => {
								navigation.navigate('Login');
							}}
						>
							<Text style={styles.content}>提现5元</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.withdrawItem}
							onPress={() => {
								navigation.navigate('Login');
							}}
						>
							<Text style={styles.content}>提现10元</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.bottomView}>
						<Image
							source={require('../../../assets/images/alipay.jpg')}
							style={{ width: SCREEN_WIDTH / 2.8, height: SCREEN_WIDTH / 3 }}
						/>
						<Text style={styles.tipsText}>
							您还没有登录哦，
							<Text
								style={{ color: Theme.linkColor }}
								onPress={() => {
									navigation.navigate('Login');
								}}
							>
								快去登录吧
							</Text>
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	statistics: {
		marginTop: PxFit(Theme.itemSpace),
		marginBottom: PxFit(Theme.itemSpace)
	},
	currentGold: {
		alignItems: 'center'
	},
	greyText1: {
		fontSize: PxFit(14),
		color: Theme.subTextColor
	},
	boldBlackText: {
		marginTop: PxFit(15),
		marginBottom: PxFit(5),
		fontSize: PxFit(30),
		fontWeight: '500',
		lineHeight: PxFit(32),
		color: Theme.secondaryColor
	},
	accumulat: {
		marginVertical: PxFit(Theme.itemSpace),
		flexDirection: 'row'
	},
	accumulated: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	line: {
		alignSelf: 'stretch',
		width: PxFit(1),
		backgroundColor: '#f0f0f0'
	},
	greyText2: {
		fontSize: PxFit(13),
		color: Theme.subTextColor
	},
	slenderBlackText: {
		marginTop: PxFit(10),
		fontSize: PxFit(17),
		lineHeight: PxFit(18),
		fontWeight: '300',
		color: Theme.defaultTextColor
	},
	gold: {
		color: Theme.secondaryColor,
		fontSize: PxFit(40),
		textAlign: 'center'
	},
	withdraws: {
		justifyContent: 'space-between',
		flex: 1
	},
	center: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: PxFit(Theme.itemSpace),
		justifyContent: 'space-between'
	},
	withdrawItem: {
		marginBottom: PxFit(Theme.itemSpace),
		width: (SCREEN_WIDTH - PxFit(Theme.itemSpace * 3)) / 2,
		height: PxFit(60),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: PxFit(5),
		backgroundColor: '#f5f5f5'
	},
	content: {
		fontSize: PxFit(16),
		color: Theme.subTextColor
	},
	bottomView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 15
	},
	tipsText: { color: Theme.subTextColor, fontSize: PxFit(13), fontWeight: '300' }
});

export default NotLogin;
