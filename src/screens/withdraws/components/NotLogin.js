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
			<View>
				<View style={styles.header}>
					<View style={{ flex: 1 }}>
						<Text style={styles.type}>剩余智慧点</Text>
						<Text style={styles.gold}>0</Text>
					</View>
					<View style={{ flex: 1 }}>
						<Text style={styles.type}>当前余(元)</Text>
						<Text style={styles.gold}>0.00</Text>
					</View>
				</View>
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
			</View>
		);
	}
}

const styles = StyleSheet.create({
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
		color: Theme.themeRed,
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
	}
});

export default NotLogin;
