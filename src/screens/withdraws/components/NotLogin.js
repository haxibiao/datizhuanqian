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
				<View>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							paddingTop: PxFit(20),
							paddingBottom: PxFit(30)
						}}
					>
						<View style={{ width: SCREEN_WIDTH / 2 }}>
							<Text style={styles.gold}>0</Text>
							<Text style={styles.type}>智慧点</Text>
						</View>
						<View style={{ width: SCREEN_WIDTH / 2 }}>
							<Text style={styles.gold}>0.00</Text>
							<Text style={styles.type}>余额（元）</Text>
						</View>
					</View>

					{/*<DivisionLine height={10} />*/}
					<View style={styles.center}>
						<TouchableOpacity
							style={styles.item}
							onPress={() => {
								navigation.navigate('登录注册');
							}}
						>
							<Text style={styles.content}>
								提现<Text style={{ color: Theme.themeRed }}>1元</Text>
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.item}
							onPress={() => {
								navigation.navigate('登录注册');
							}}
						>
							<Text style={styles.content}>
								提现<Text style={{ color: Theme.themeRed }}>2元</Text>
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.item}
							onPress={() => {
								navigation.navigate('登录注册');
							}}
						>
							<Text style={styles.content}>
								提现<Text style={{ color: Theme.themeRed }}>5元</Text>
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.item}
							onPress={() => {
								navigation.navigate('登录注册');
							}}
						>
							<Text style={styles.content}>
								提现<Text style={{ color: Theme.themeRed }}>10元</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</View>
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
		paddingVertical: PxFit(25),
		alignItems: 'center'
	},
	gold: {
		color: Theme.themeRed,
		fontSize: PxFit(44),
		paddingBottom: PxFit(2),
		textAlign: 'center'
	},
	type: {
		color: Theme.grey,
		fontSize: PxFit(13),
		textAlign: 'center'
	},
	center: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: PxFit(15),
		justifyContent: 'space-between'
	},
	item: {
		paddingVertical: PxFit(25),
		width: (SCREEN_WIDTH - PxFit(44)) / 2,
		borderColor: '#E0E0E0',
		borderWidth: PxFit(0.5),
		alignItems: 'center',
		marginTop: PxFit(20),
		borderRadius: PxFit(5)
	},
	content: {
		fontSize: PxFit(16),
		color: Theme.black
	},
	footer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: PxFit(20)
	},
	tips: {
		fontSize: PxFit(15),
		color: '#363636'
	}
});

export default NotLogin;
