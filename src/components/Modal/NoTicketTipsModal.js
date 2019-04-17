import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import BasicModal from './BasicModal';

import { Colors, Divice } from '../../constants';
import Button from '../Control/Button';

const { width, height } = Dimensions.get('window');

class NoTicketTipsModal extends Component {
	render() {
		const { visible, handleVisible, nextQuestion, gold } = this.props;
		return (
			<BasicModal
				visible={visible}
				handleVisible={handleVisible}
				customStyle={{
					width: (width * 2) / 3,
					borderRadius: 5,
					backgroundColor: '#fff',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingVertical: 20,
					paddingHorizontal: 20
				}}
				header={<Text style={styles.false}>精力点不足</Text>}
			>
				<Image source={require('../../../assets/images/tips.png')} style={{ height: 120, width: 120 }} />
				<View style={styles.content}>
					<Text style={styles.text}>继续答题不再奖励智慧点</Text>
					<Text style={styles.text}>每日零时将重置精力</Text>
				</View>
				<Button
					name={'知道了'}
					disabled={false}
					handler={handleVisible}
					style={{ height: 34, width: (width * 2) / 3 - 40, borderRadius: 17 }}
					theme={Colors.theme}
					fontSize={14}
				/>
			</BasicModal>
		);
	}
}

const styles = StyleSheet.create({
	true: {
		fontSize: 20,
		paddingTop: 15,
		color: Colors.theme
	},
	false: {
		fontSize: 20,
		paddingTop: 5,
		color: Colors.grey
	},
	content: {
		alignItems: 'center',
		marginVertical: 10
	},
	text: {
		fontSize: 13,
		color: Colors.black,
		paddingVertical: 2
	}
});

export default NoTicketTipsModal;
