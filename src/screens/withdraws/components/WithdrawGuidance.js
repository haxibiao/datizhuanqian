/*
 * @flow
 * created by wyk made in 2019-03-26 18:08:36
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, WPercent } from '../../../utils';

class WithdrawGuidance extends Component {
	render() {
		let { tips, navigation } = this.props;
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
					source={require('../../../assets/images/alipay.jpg')}
					style={{ width: SCREEN_WIDTH / 3, height: SCREEN_WIDTH / 3 }}
				/>
				<Text style={{ color: Theme.subTextColor, fontSize: PxFit(13), fontWeight: '300' }}>
					{tips ? tips : '目前没有绑定支付宝账户哦'}
				</Text>

				<TouchableOpacity
					onPress={() => {
						navigation.navigate('ModifyAliPay');
					}}
					style={{ alignItems: 'center' }}
				>
					<Text
						style={{
							color: Theme.linkColor,
							fontSize: PxFit(13),
							fontWeight: '300',
							paddingTop: PxFit(10)
						}}
					>
						请先绑定支付宝账号哦
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default WithdrawGuidance;
