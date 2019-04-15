/*
 * @flow
 * created by wyk made in 2019-04-12 15:59:25
 */
'use strict';
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	FlatList,
	Image,
	TextInput,
	ScrollView,
	Keyboard
} from 'react-native';
import { Button, Avatar, PageContainer, TouchFeedback, CustomTextInput, Row, Iconfont } from '../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';
import { connect } from 'react-redux';
import { createCurationMutation } from '../../assets/graphql/question.graphql';
import { graphql, compose } from 'react-apollo';

let REWARD_VALUE = ['10', '50', '100', '200', '400', '800'];
let WIDTH_LIMIT = PxFit(280);

class Reward extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ticket: '10'
		};
	}

	onChangeText = ticket => {
		ticket = String(ticket).replace(/[^0-9]|^0+/gi, '');
		if (ticket > 10000) {
			ticket = '10000';
		}
		this.setState({ ticket });
	};

	renderRewardValue() {
		let { ticket } = this.state;
		return REWARD_VALUE.map((elem, index) => {
			let selected = ticket === elem;
			return (
				<TouchFeedback
					style={[
						styles.valueItem,
						selected && { backgroundColor: Theme.primaryColor, borderColor: Theme.primaryColor }
					]}
					key={index}
					onPress={() => this.setState({ ticket: elem + '' })}
				>
					<Row>
						<Iconfont name="diamond" size={PxFit(13)} color={selected ? '#fff' : Theme.subTextColor} />
						<Text style={[styles.valueItemText, selected && { color: '#fff' }]}>{elem}</Text>
					</Row>
				</TouchFeedback>
			);
		});
	}

	render() {
		let { ticket } = this.state;
		let { navigation } = this.props;
		let question = navigation.getParam('question', {});
		return (
			<PageContainer white title="打赏" autoKeyboardInsets={false}>
				<View style={styles.container}>
					<View>
						<View style={styles.userPanel}>
							<Avatar source={question.user.avatar} size={PxFit(50)} />
							<Text style={styles.name}>{question.user.name}</Text>
							<Row>
								<Text style={styles.paragraph}>“</Text>
								<Text style={styles.slogan}> 尊重知识，作者将收到你的智慧点赞赏 </Text>
								<Text style={styles.paragraph}>”</Text>
							</Row>
						</View>
						<View style={{ alignItems: 'center' }}>
							<View style={styles.options}>{this.renderRewardValue()}</View>
						</View>
						<View style={{ alignItems: 'center' }}>
							<Row style={styles.inputContainer}>
								<Image source={require('../../assets/images/diamond.png')} style={styles.diamondIcon} />
								<CustomTextInput
									style={styles.inputStyle}
									onChangeText={this.onChangeText}
									keyboardType="numeric"
									placeholder={'10~10000'}
									value={ticket}
								/>
							</Row>
						</View>
					</View>
					<View style={styles.bottom}>
						<TouchFeedback
							style={[styles.paymentButton, ticket && { backgroundColor: Theme.weixin }]}
							onPress={this.onPayment}
						>
							<Text style={styles.paymentButtonText}>赞赏</Text>
						</TouchFeedback>
						<Text style={styles.bottomText}>给作者加个鸡腿吧</Text>
					</View>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		backgroundColor: '#fff'
	},
	userPanel: {
		alignItems: 'center',
		paddingBottom: PxFit(30),
		marginBottom: PxFit(30),
		marginTop: PxFit(Theme.itemSpace),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	name: {
		fontSize: PxFit(13),
		color: Theme.subTextColor,
		marginTop: PxFit(10),
		marginBottom: PxFit(Theme.itemSpace)
	},
	paragraph: {
		fontSize: PxFit(17),
		color: Theme.subTextColor
	},
	slogan: {
		fontSize: PxFit(16),
		color: Theme.defaultTextColor
	},
	options: {
		width: WIDTH_LIMIT,
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	valueItem: {
		marginBottom: PxFit(20),
		width: (WIDTH_LIMIT - 20) / 3,
		height: PxFit(40),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: PxFit(0.5),
		borderRadius: PxFit(20),
		borderColor: Theme.borderColor
	},
	valueItemText: {
		fontSize: PxFit(14),
		color: Theme.defaultTextColor,
		marginLeft: PxFit(4)
	},
	inputContainer: {
		width: WIDTH_LIMIT,
		paddingLeft: WIDTH_LIMIT / 3,
		paddingVertical: PxFit(5),
		marginVertical: PxFit(10),
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: PxFit(1),
		borderBottomColor: '#f0f0f0'
	},
	diamondIcon: {
		width: PxFit(22),
		height: PxFit(24),
		marginBottom: PxFit(4)
	},
	inputStyle: {
		flex: 1,
		height: PxFit(32),
		paddingHorizontal: PxFit(10),
		fontSize: PxFit(16),
		fontWeight: '500',
		color: Theme.defaultTextColor
	},
	bottom: {
		alignItems: 'center',
		paddingBottom: Theme.HOME_INDICATOR_HEIGHT || PxFit(Theme.itemSpace)
	},
	paymentButton: {
		width: WIDTH_LIMIT,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: PxFit(40),
		borderRadius: PxFit(20),
		marginBottom: PxFit(40),
		backgroundColor: '#f0f0f0'
	},
	paymentButtonText: {
		fontSize: PxFit(15),
		color: '#fff',
		letterSpacing: PxFit(2)
	},
	bottomText: {
		fontSize: PxFit(14),
		color: Theme.subTextColor
	}
});

export default Reward;
