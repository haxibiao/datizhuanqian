/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 14:41:10
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from '../../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';
import { Overlay } from 'teaset';

class RuleDescription extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<View
				style={{
					width: SCREEN_WIDTH - PxFit(70),
					paddingHorizontal: PxFit(25),
					paddingVertical: PxFit(20),
					borderRadius: PxFit(15),
					backgroundColor: '#fff'
				}}
			>
				<Text style={{ color: Theme.defaultTextColor, fontSize: PxFit(21), textAlign: 'center' }}>
					规则说明
				</Text>

				<View style={{ marginTop: PxFit(5) }}>
					<Text style={styles.text}>1.只有当您绑定支付宝账号之后，才能开始提现，每天最多进行3次提现。</Text>
					<Text style={styles.text}>
						2.提现金额分为1元(600)、3元(1800)、5元(3000)、10元(6000)四档，每次提现时会优先扣除钱包内的余额再扣除智慧点，剩余智慧点可以在下次满足最低提现额度时申请提现。
					</Text>
					<Text style={styles.text}>
						3.一个人名下只能绑定一个支付宝提现，同一人使用多个账号提现系统将判定涉嫌恶意刷取智慧点，答题赚钱官方有权限制提现功能。
					</Text>
					<Text style={styles.text}>4.提现一般3~5天内到账(如遇提现高峰，提现到账时间会延长)。</Text>
				</View>
				<Button title={'知道了'} onPress={() => this.props.hide()} style={styles.buttonText} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	text: {
		paddingVertical: PxFit(5),
		lineHeight: PxFit(18),
		fontSize: PxFit(13),
		color: Theme.subTextColor
	},
	buttonText: {
		height: PxFit(38),
		borderRadius: PxFit(19),
		marginTop: PxFit(10),
		backgroundColor: Theme.primaryColor
	}
});

export default RuleDescription;
