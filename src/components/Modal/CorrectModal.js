import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import BasicModal from './BasicModal';
import { Iconfont } from '../../utils/Fonts';
import { Colors, Divice } from '../../constants';
import { Button } from '../Control';

const { width, height } = Dimensions.get('window');

class CorrectModal extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}
	componentWillUpdate() {
		let { CloseModal } = this.props;
		CloseModal();
	}
	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	render() {
		const { visible, handleVisible, title, nextQuestion, gold, noTicketTips, answer, user } = this.props;
		return (
			<BasicModal
				visible={visible}
				handleVisible={handleVisible}
				customStyle={{
					width: (width * 3) / 5,
					height: (width * 5) / 7,
					borderRadius: 5,
					alignItems: 'center',
					justifyContent: 'center'
				}}
				header={
					<Text style={title ? styles.true : styles.false}>
						{title ? '恭喜你回答正确' : '很遗憾,回答错误'}
					</Text>
				}
			>
				<TouchableOpacity
					style={{
						backgroundColor: '#FDEC85',
						borderRadius: 90,
						width: 20,
						height: 20,
						alignItems: 'center',
						justifyContent: 'flex-end',
						position: 'absolute',
						top: -10,
						right: -10
					}}
					onPress={handleVisible}
				>
					<Iconfont name={'close'} size={16} color={'rgba(48,48,48,0.8)'} />
				</TouchableOpacity>
				<Image
					source={
						title
							? require('../../../assets/images/right.png')
							: require('../../../assets/images/error.png')
					}
					style={{ height: 100, width: 100, marginTop: 15 }}
				/>
				{title ? (
					<View style={styles.content}>
						{user.ticket > 0 && <Iconfont name={'zhuanshi'} size={18} color={Colors.theme} />}
						<Text style={styles.text}>{user.ticket > 0 ? '智慧点' + '+' + gold : ' 经验值+1'}</Text>
					</View>
				) : (
					<View style={styles.content}>
						<Text
							style={{
								fontSize: 13,
								color: Colors.weixin
							}}
						>
							正确答案:{answer}
						</Text>
					</View>
				)}
				{/*<Button
					name={"下一题"}
					disabled={false}
					handler={nextQuestion}
					style={{ height: 34, paddingHorizontal: 42 }}
					theme={Colors.blue}
					fontSize={14}
				/>*/}
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

export default CorrectModal;
