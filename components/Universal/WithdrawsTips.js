import React, { Component } from 'react';
import Colors from '../../constants/Colors';

import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

class WithdrawsTips extends Component {
	render() {
		let { tips, method, navigation } = this.props;
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					paddingHorizontal: 15
				}}
			>
				<Image
					source={require('../../assets/images/alipay.jpg')}
					style={{ width: width / 3, height: width / 3 }}
				/>
				<Text style={{ color: Colors.grey, fontSize: 13, fontWeight: '300' }}>
					{tips ? tips : '目前没有绑定支付宝账户哦'}
				</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text
						style={{
							color: Colors.grey,
							fontSize: 13,
							fontWeight: '300',
							paddingTop: 10
						}}
					>
						{method ? method : '请前往我的 - 设置 - 支付宝账号页面进行'}
					</Text>
					{!method && (
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('我的账户');
							}}
							style={{ alignItems: 'center' }}
						>
							<Text
								style={{
									color: Colors.weixin,
									fontSize: 13,
									fontWeight: '300',
									paddingTop: 10
								}}
							>
								绑定
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default WithdrawsTips;
