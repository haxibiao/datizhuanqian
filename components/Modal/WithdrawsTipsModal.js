import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import BasicModal from './BasicModal';
import { Iconfont } from '../../utils/Fonts';
import { Colors, Divice } from '../../constants';
import { Button } from '../Control';

const { width, height } = Dimensions.get('window');

class WithdrawsTipsModal extends Component {
	render() {
		const { visible, handleVisible, nextQuestion, gold } = this.props;
		return (
			<BasicModal
				visible={visible}
				handleVisible={handleVisible}
				customStyle={{
					width: width - 70,
					height: width / 2,
					borderRadius: 20,
					alignItems: 'center',
					paddingTop: 20
				}}
				header={<Text style={{ color: Colors.black, fontSize: 18 }}>提示</Text>}
			>
				<View
					style={{
						justifyContent: 'space-between',
						flex: 1,
						marginTop: 10,
						width: width - 100
					}}
				>
					<View style={{ alignItems: 'center' }}>
						<Text style={{ paddingVertical: 5, lineHeight: 18, fontSize: 15, color: Colors.grey }}>
							智慧点不足，快去答题赚钱吧~
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

const styles = StyleSheet.create({});

export default WithdrawsTipsModal;
