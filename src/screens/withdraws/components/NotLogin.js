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
				<View style={styles.header}>
					<View style={{ flex: 1 }}>
						<Text style={styles.type}>当前智慧点</Text>
						<Text style={styles.gold}>0</Text>
					</View>
					<View style={{ flex: 1 }}>
						<Text style={styles.type}>当前余额(元)</Text>
						<Text style={styles.gold}>0.00</Text>
					</View>
				</View>
				<View style={styles.withdraws}>
					<View style={styles.center}>
						<TouchableOpacity
							style={styles.withdrawItem}
							onPress={() => {
								navigation.navigate('Register');
							}}
						>
							<Text style={styles.content}>提现1元</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.withdrawItem}
							onPress={() => {
								navigation.navigate('Register');
							}}
						>
							<Text style={styles.content}>提现2元</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.withdrawItem}
							onPress={() => {
								navigation.navigate('Register');
							}}
						>
							<Text style={styles.content}>提现5元</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.withdrawItem}
							onPress={() => {
								navigation.navigate('Register');
							}}
						>
							<Text style={styles.content}>提现10元</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.bottomView}>
						<Image
							source={require('../../../assets/images/alipay.jpg')}
							style={{ width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3 }}
						/>
						<Text style={styles.tipsText}>
							您还没有登录哦，
							<Text
								style={{ color: Theme.linkColor }}
								onPress={() => {
									navigation.navigate('Register');
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
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: PxFit(30)
	},
	type: {
		color: Theme.subTextColor,
		fontSize: PxFit(13),
		textAlign: 'center',
		marginBottom: PxFit(10)
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
