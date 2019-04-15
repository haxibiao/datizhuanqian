/*
 * @flow
 * created by wyk made in 2019-04-10 17:56:01
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { PageContainer, TouchFeedback, CustomTextInput, Iconfont, Row, Button, KeyboardSpacer } from '../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';

import { connect } from 'react-redux';
import { WithdrawsQuery } from '../../assets/graphql/withdraws.graphql';
import { UserWithdrawQuery } from '../../assets/graphql/user.graphql';
import { Query } from 'react-apollo';

import { Overlay } from 'teaset';

let TOP_UP_VALUE = [1, 10, 20, 50, 100];
let PAYMENT_TYPE = {
	ZFB: 0,
	WX: 1
};

class InputMoney extends Component {
	constructor(props) {
		super(props);
		this.state = {
			money: String(props.money).replace(/[^0-9]|^0+/gi, '')
		};
	}

	onChangeText = money => {
		money = String(money).replace(/[^0-9]|^0+/gi, '');
		if (money.length > 3) {
			money = '1000';
		}
		this.setState({ money });
	};

	render() {
		let { money } = this.state;
		let { setMoney } = this.props;
		return (
			<View style={styles.overlayBody}>
				<View>
					<Text style={styles.overlayTitle}>自定义金额</Text>
				</View>
				<View>
					<CustomTextInput
						style={StyleSheet.flatten([styles.overlayChangeView, styles.inputStyle])}
						onChangeText={this.onChangeText}
						keyboardType="numeric"
						value={money}
					/>
				</View>
				<View>
					<Text style={styles.overlayTip}>金额为1~1000之间的整数</Text>
				</View>
				<Button
					title="确定"
					onPress={() => setMoney(money)}
					style={StyleSheet.flatten([styles.overlayChangeView, styles.overlayButton])}
				/>
			</View>
		);
	}
}

class TopUp extends Component {
	constructor(props) {
		super(props);

		this.state = {
			money: 1,
			custom_money: 0,
			paymentType: PAYMENT_TYPE.ZFB
		};
	}

	setMoney = custom_money => {
		this.setState({
			money: 0,
			custom_money
		});
		Overlay.hide(this.OverlayKey);
	};

	showCustomMoney = () => {
		let { money, custom_money } = this.state;
		console.log('showCustomMoney');
		let overlayView = (
			<Overlay.View animated style={styles.overlayInner}>
				<InputMoney money={custom_money} setMoney={this.setMoney} />
				<KeyboardSpacer />
			</Overlay.View>
		);
		this.OverlayKey = Overlay.show(overlayView);
	};

	onPayment = () => {
		let { navigation } = this.props;
		navigation.navigate('Payment');
	};

	rendertopUpValue() {
		let { exchangeRate } = this.props;
		let { money } = this.state;
		return TOP_UP_VALUE.map((elem, index) => {
			let selected = money === elem;
			return (
				<TouchFeedback
					style={[styles.valueItem, selected && styles.selectedItem]}
					key={index}
					onPress={() => this.setState({ money: elem, custom_money: 0 })}
				>
					<Row>
						<Image source={require('../../assets/images/diamond.png')} style={styles.diamond} />
						<Text style={[styles.valueItemText, selected && { color: Theme.primaryColor }]}>
							{elem * exchangeRate}
						</Text>
					</Row>
					<Row>
						<Iconfont
							name="RMB"
							size={PxFit(13)}
							color={selected ? Theme.primaryColor : Theme.subTextColor}
						/>
						<Text style={[styles.moneyText, selected && { color: Theme.primaryColor }]}>{elem}</Text>
					</Row>
				</TouchFeedback>
			);
		});
	}

	rendertopUpCustomValue() {
		let { custom_money } = this.state;
		let { exchangeRate } = this.props;
		return (
			<TouchFeedback
				style={[styles.valueItem, custom_money && styles.selectedItem]}
				onPress={this.showCustomMoney}
			>
				<Row>
					<Image source={require('../../assets/images/diamond.png')} style={styles.diamond} />
					<Text style={[styles.valueItemText, custom_money && { color: Theme.primaryColor }]}>
						{custom_money * exchangeRate || '自定义'}
					</Text>
				</Row>
				{custom_money > 0 ? (
					<Row>
						<Iconfont name="RMB" size={PxFit(13)} color={Theme.primaryColor} />
						<Text style={[styles.moneyText, { color: Theme.primaryColor }]}>{custom_money}</Text>
					</Row>
				) : (
					<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
				)}
			</TouchFeedback>
		);
	}

	render() {
		let { money, custom_money, paymentType } = this.state;
		let { navigation } = this.props;
		let user = this.props.navigation.getParam('user', {});
		let ZFB = paymentType === PAYMENT_TYPE.ZFB;
		return (
			<PageContainer
				white
				title="充值"
				rightView={
					<TouchFeedback onPress={() => navigation.navigate('TopUpLog')} style={styles.headerRight}>
						<Text style={styles.headerRightText}>充值记录</Text>
					</TouchFeedback>
				}
			>
				<ScrollView
					style={styles.container}
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="always"
					showsVerticalScrollIndicator={false}
					bounces={false}
				>
					<Row style={styles.userGold}>
						<Text style={styles.panelTitle}>当前智慧点</Text>
						<Text style={styles.goldText}>{user.gold}</Text>
					</Row>
					<View style={styles.topUpPanel}>
						<View>
							<Text style={styles.panelTitle}>请选择充值智慧点</Text>
						</View>
						<View style={styles.moneyOptions}>
							{this.rendertopUpValue()}
							{this.rendertopUpCustomValue()}
						</View>
						<View style={{ marginTop: PxFit(25), marginBottom: PxFit(Theme.itemSpace) }}>
							<Text style={styles.panelTitle}>支付方式</Text>
						</View>
						<TouchFeedback
							style={styles.paymentItem}
							onPress={() => {
								this.setState({ paymentType: PAYMENT_TYPE.ZFB });
							}}
						>
							<Row>
								<Image
									source={require('../../assets/images/zhifubao.png')}
									style={styles.paymentImage}
								/>
								<Text style={styles.paymentText}>支付宝支付</Text>
							</Row>
							<Iconfont
								name={ZFB ? 'success-fill' : 'success'}
								size={PxFit(20)}
								color={ZFB ? Theme.correctColor : Theme.subTextColor}
							/>
						</TouchFeedback>
						<TouchFeedback
							style={styles.paymentItem}
							onPress={() => {
								this.setState({ paymentType: PAYMENT_TYPE.WX });
							}}
						>
							<Row>
								<Image source={require('../../assets/images/weixin.png')} style={styles.paymentImage} />
								<Text style={styles.paymentText}>微信支付</Text>
							</Row>
							<Iconfont
								name={ZFB ? 'success' : 'success-fill'}
								size={PxFit(20)}
								color={ZFB ? Theme.subTextColor : Theme.correctColor}
							/>
						</TouchFeedback>
						<TouchFeedback style={styles.paymentButton} onPress={this.onPayment}>
							<Text style={styles.paymentButtonText}>支付</Text>
							<Iconfont name="RMB" size={PxFit(13)} color={'#fff'} />
							<Text style={styles.paymentButtonText}>{money || custom_money}</Text>
						</TouchFeedback>
					</View>
				</ScrollView>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f9f9f9'
	},
	headerRight: {
		flexGrow: 1,
		justifyContent: 'center'
	},
	headerRightText: {
		fontSize: PxFit(15),
		textAlign: 'center',
		color: Theme.primaryColor
	},
	userGold: {
		paddingHorizontal: PxFit(Theme.itemSpace + 10),
		paddingVertical: PxFit(20),
		backgroundColor: '#fff'
	},
	goldText: {
		marginLeft: PxFit(20),
		fontSize: PxFit(22),
		fontWeight: '500',
		color: Theme.primaryColor
	},
	topUpPanel: {
		margin: PxFit(10),
		paddingHorizontal: PxFit(Theme.itemSpace),
		paddingVertical: PxFit(20),
		borderRadius: PxFit(10),
		backgroundColor: '#fff'
	},
	panelTitle: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor
	},
	moneyOptions: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between'
	},
	valueItem: {
		marginTop: PxFit(Theme.itemSpace),
		width: (SCREEN_WIDTH - PxFit(Theme.itemSpace * 2) - PxFit(30)) / 2,
		height: PxFit(48),
		paddingHorizontal: PxFit(8),
		borderWidth: PxFit(1),
		borderRadius: PxFit(24),
		borderColor: Theme.borderColor,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	selectedItem: {
		borderColor: Theme.primaryColor,
		backgroundColor: `rgba(${Theme.primaryColorRgb},0.2)`
	},
	diamond: {
		width: PxFit(20),
		height: PxFit(22),
		marginBottom: PxFit(4),
		marginRight: PxFit(2)
	},
	valueItemText: {
		fontSize: PxFit(15),
		fontWeight: '500',
		color: Theme.defaultTextColor
	},
	moneyText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor
	},
	overlayInner: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	overlayBody: {
		maxWidth: PxFit(300),
		minWidth: PxFit(240),
		marginHorizontal: PxFit(30),
		paddingHorizontal: PxFit(Theme.itemSpace),
		paddingVertical: PxFit(25),
		borderRadius: PxFit(8),
		backgroundColor: '#fff'
	},
	overlayTitle: {
		fontSize: PxFit(18),
		color: Theme.defaultTextColor,
		textAlign: 'center'
	},
	overlayTip: {
		fontSize: PxFit(12),
		color: Theme.subTextColor,
		marginTop: PxFit(10)
	},
	overlayChangeView: {
		height: PxFit(36),
		borderRadius: PxFit(4),
		paddingHorizontal: PxFit(10),
		marginTop: PxFit(25),
		backgroundColor: '#f0f0f0'
	},
	inputStyle: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor
	},
	overlayButton: {
		backgroundColor: Theme.primaryColor
	},
	paymentItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: PxFit(Theme.itemSpace),
		paddingVertical: PxFit(5)
	},
	paymentImage: {
		width: PxFit(26),
		height: PxFit(26),
		marginRight: PxFit(10)
	},
	paymentText: {
		fontSize: PxFit(14),
		color: Theme.defaultTextColor
	},
	paymentButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: PxFit(44),
		borderRadius: PxFit(6),
		marginTop: PxFit(10),
		backgroundColor: Theme.primaryColor
	},
	paymentButtonText: {
		fontSize: PxFit(15),
		color: '#fff'
	}
});

export default connect(store => {
	return { exchangeRate: store.app.exchangeRate, user: store.users.user };
})(TopUp);
