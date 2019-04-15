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
					borderRadius: 5,
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
				header={<Text style={styles.false}>没有精力点了哦</Text>}
			>
				<Image source={require('../../../assets/images/tips.png')} style={{ height: 100, width: 100 }} />
				<View style={styles.content}>
					<Text style={styles.text}>继续答题将不再增加智慧点</Text>
					<Text style={styles.text}>精力点将在24小时后自动恢复</Text>
				</View>
				<Button
					name={'知道了'}
					disabled={false}
					handler={handleVisible}
					style={{ height: 34, paddingHorizontal: 42 }}
					theme={Colors.blue}
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
		paddingTop: 15,
		color: Colors.grey
	},
	content: {
		alignItems: 'center'
	},
	text: {
		fontSize: 13,
		color: Colors.theme
	}
});

export default NoTicketTipsModal;
