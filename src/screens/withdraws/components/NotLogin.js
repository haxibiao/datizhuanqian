/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 10:37:53
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, Dimensions, Slider } from 'react-native';

import { DivisionLine, WithdrawsTips } from '../Universal';
import { Colors, Config, Divice } from '../../constants';

class NotLogin extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { navigation } = this.props;
		return (
			<View style={styles.container}>
				<View>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							paddingTop: 20,
							paddingBottom: 30
						}}
					>
						<View style={{ width: Divice.width / 2 }}>
							<Text style={styles.gold}>0</Text>
							<Text style={styles.type}>智慧点</Text>
						</View>
						<View style={{ width: Divice.width / 2 }}>
							<Text style={styles.gold}>0.00</Text>
							<Text style={styles.type}>余额（元）</Text>
						</View>
					</View>

					<DivisionLine height={10} />
					<View style={styles.center}>
						<TouchableOpacity
							style={styles.item}
							onPress={() => {
								navigation.navigate('登录注册');
							}}
						>
							<Text style={styles.content}>
								提现<Text style={{ color: Colors.themeRed }}>1元</Text>
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.item}
							onPress={() => {
								navigation.navigate('登录注册');
							}}
						>
							<Text style={styles.content}>
								提现<Text style={{ color: Colors.themeRed }}>2元</Text>
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.item}
							onPress={() => {
								navigation.navigate('登录注册');
							}}
						>
							<Text style={styles.content}>
								提现<Text style={{ color: Colors.themeRed }}>5元</Text>
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.item}
							onPress={() => {
								navigation.navigate('登录注册');
							}}
						>
							<Text style={styles.content}>
								提现<Text style={{ color: Colors.themeRed }}>10元</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<WithdrawsTips tips={'还没有登录账号哦'} method={'登录后绑定支付宝账户即可进行提现'} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFEFC'
	},
	header: {
		paddingVertical: 25,
		alignItems: 'center'
	},
	gold: {
		color: Colors.themeRed,
		fontSize: 44,
		paddingBottom: 2,
		textAlign: 'center'
	},
	type: {
		color: Colors.grey,
		fontSize: 13,
		textAlign: 'center'
	},
	center: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: 15,
		justifyContent: 'space-between'
	},
	item: {
		paddingVertical: 25,
		width: (Divice.width - 44) / 2,
		borderColor: '#E0E0E0',
		borderWidth: 0.5,
		alignItems: 'center',
		marginTop: 20,
		borderRadius: 5
	},
	content: {
		fontSize: 16,
		color: Colors.black
	},
	footer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 20
	},
	tips: {
		fontSize: 15,
		color: '#363636'
	}
});

export default NotLogin;
