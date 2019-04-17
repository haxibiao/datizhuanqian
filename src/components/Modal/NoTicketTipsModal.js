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
					width: 260,
					height: 300,
					borderRadius: 10,
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
				header={<Text style={styles.false}>精力点不足</Text>}
			>
				<Image source={require('../../../assets/images/tips.png')} style={{ height: 110, width: 110 }} />
				<View style={styles.content}>
					<Text style={styles.text}>继续答题不再奖励智慧点</Text>
					<Text style={styles.text}>精力点恢复时间</Text>
					<Text style={styles.text}>{'2019-04-16 16:04:08'}</Text>
				</View>
				<Button
					name={'知道了'}
					disabled={false}
					handler={handleVisible}
					style={{ height: 34, paddingHorizontal: 42 }}
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
		color: Colors.theme,
		paddingVertical: 2
	}
});

export default NoTicketTipsModal;
