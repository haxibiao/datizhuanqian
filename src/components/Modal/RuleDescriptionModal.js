import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import BasicModal from './BasicModal';

import { Colors, Divice } from '../../constants';
import Button from '../Control/Button';

const { width, height } = Dimensions.get('window');

class RuleDescriptionModal extends Component {
	render() {
		const { visible, handleVisible, nextQuestion, gold } = this.props;
		return (
			<BasicModal
				visible={visible}
				handleVisible={handleVisible}
				customStyle={{
					width: width - 70,
					height: width,
					borderRadius: 20,
					alignItems: 'center',
					paddingHorizontal: 40
				}}
				header={<Text style={{ color: Colors.black, fontSize: 22 }}>规则说明</Text>}
			>
				<View style={{ justifyContent: 'space-between', flex: 1 }}>
					<View>
						<Text style={{ paddingVertical: 5, lineHeight: 18, fontSize: 13, color: Colors.grey }}>
							1.只有当您绑定支付宝账号之后，才能开始提现，每天最多进行3次提现。
						</Text>
						<Text style={{ paddingVertical: 5, lineHeight: 18, fontSize: 13, color: Colors.grey }}>
							2.提现金额分为1元(600)、3元(1800)、5元(3000)、10元(6000)四档，每次提现时会优先扣除钱包内的余额再扣除智慧点，剩余智慧点可以在下次满足最低提现额度时申请提现。
						</Text>
						<Text style={{ paddingVertical: 5, lineHeight: 18, fontSize: 13, color: Colors.grey }}>
							3.提现一般3~5天内到账(如遇提现高峰，提现到账时间会延长)。
						</Text>
					</View>
					<Button
						name={'知道了'}
						style={{ height: 38, borderRadius: 19 }}
						handler={handleVisible}
						theme={Colors.theme}
						fontSize={14}
					/>
				</View>
			</BasicModal>
		);
	}
}

const styles = StyleSheet.create({
	true: {
		fontSize: 20,
		paddingTop: 15,
		color: Colors.theme
	}
});

export default RuleDescriptionModal;
