import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import BasicModal from './BasicModal';
import { Iconfont } from '../../utils/Fonts';
import { Colors, Divice } from '../../constants';
import Button from '../Control/Button';

const { width, height } = Dimensions.get('window');

class TaskRewardModal extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		const { visible, handleVisible, title, nextQuestion, gold, noTicketTips, answer } = this.props;
		return (
			<BasicModal
				visible={visible}
				handleVisible={handleVisible}
				customStyle={{
					width: (width * 5) / 6,
					height: (width * 5) / 6,
					borderRadius: 10,
					padding: 0
				}}
			>
				<View>
					<View
						style={{
							backgroundColor: Colors.theme,
							height: width / 3,
							width: (width * 5) / 6,
							alignItems: 'center',
							justifyContent: 'center',
							borderTopLeftRadius: 10,
							borderTopRightRadius: 10
						}}
					>
						<Text style={{ fontSize: 24, color: Colors.white }}>编辑头像</Text>
					</View>
					<View style={{}}>
						<Text style={{ fontSize: 16, color: Colors.black }}>获得20个智慧点</Text>
						<Text style={{ fontSize: 16, color: Colors.black }}>智慧点可以购买道具提现哦~</Text>
					</View>
				</View>
			</BasicModal>
		);
	}
}

const styles = StyleSheet.create({
	true: {
		fontSize: 18,
		paddingTop: 15,
		color: Colors.theme
	},
	false: {
		fontSize: 18,
		paddingTop: 15,
		color: Colors.grey
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 15
	},
	text: {
		fontSize: 13,
		color: Colors.theme
	}
});

export default TaskRewardModal;
