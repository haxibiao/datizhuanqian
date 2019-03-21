/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 14:21:41
 */

import React, { Component } from 'react';
import { Theme, SCREEN_WIDTH } from '../../../utils';

import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';

class WithdrawsTips extends Component {
	render() {
		let { navigation } = this.props;
		return (
			<View style={styles.container}>
				<Image
					source={require('../../../assets/images/alipay.jpg')}
					style={{ width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3 }}
				/>
				<Text style={styles.tipsText}>{'目前没有绑定支付宝账户哦'}</Text>
				<View style={styles.content}>
					<Text style={styles.contentText}>{'请前往我的 - 设置 - 支付宝账号页面进行'}</Text>

					<TouchableOpacity
						onPress={() => {
							navigation.navigate('我的账户');
						}}
						style={{ alignItems: 'center' }}
					>
						<Text style={styles.navigateText}>绑定</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 15
	},
	tipsText: {
		color: Theme.grey,
		fontSize: 13,
		fontWeight: '300'
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	contentText: {
		color: Theme.grey,
		fontSize: 13,
		fontWeight: '300',
		paddingTop: 10
	},
	navigateText: {
		color: Theme.weixin,
		fontSize: 13,
		fontWeight: '300',
		paddingTop: 10
	}
});

export default WithdrawsTips;
