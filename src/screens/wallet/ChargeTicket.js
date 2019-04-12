/*
 * @flow
 * created by wyk made in 2019-04-10 17:56:23
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, ScrollView, Image, Keyboard } from 'react-native';
import { PageContainer, TouchFeedback, CustomTextInput, Iconfont, Row, Button, PopOverlay } from '../../components';
import { Theme, PxFit, SCREEN_WIDTH, ISIOS } from '../../utils';

import { connect } from 'react-redux';
import { WithdrawsQuery } from '../../assets/graphql/withdraws.graphql';
import { UserWithdrawQuery, UserQuery } from '../../assets/graphql/user.graphql';
import { Query } from 'react-apollo';

import { Overlay } from 'teaset';

let EXCHANGE_VALUE = [10, 20, 50, 100];

class ChargeTicket extends Component {
	constructor(props) {
		super(props);
		this.showListener = null;
		this.state = {
			ticket: ''
		};
	}

	componentDidMount() {
		if (!this.showListener) {
			let name = ISIOS ? 'keyboardWillShow' : 'keyboardDidShow';
			this.showListener = Keyboard.addListener(name, e => this.onKeyboardShow(e));
		}
	}

	componentWillUnmount() {
		if (this.showListener) {
			this.showListener.remove();
			this.showListener = null;
		}
	}

	onKeyboardShow(e) {
		console.log('onKeyboardShow');
		this._scrollView && this._scrollView.scrollTo({ x: 0, y: 200, animated: true });
	}

	onChangeText = ticket => {
		ticket = String(ticket).replace(/[^0-9]|^0+/gi, '');
		if (ticket > this.ticketMax) {
			ticket = String(this.ticketMax);
		}
		this.setState({ ticket });
	};

	onExchange = elem => {
		PopOverlay({ content: `确定消耗${elem}智慧点来兑换${elem}精力点吗？` });
	};

	renderExchangeValue() {
		let { exchangeRate } = this.props;
		return EXCHANGE_VALUE.map((elem, index) => {
			return (
				<View style={styles.valueItem} key={index}>
					<Row>
						<Image source={require('../../assets/images/heart.png')} style={styles.heartIcon} />
						<Text style={styles.valueItemText}>{elem}</Text>
					</Row>
					<TouchFeedback style={styles.exchangeButton} onPress={() => this.onExchange(elem)}>
						<Row>
							<Iconfont name="diamond" size={PxFit(14)} color={'#fff'} />
							<Text style={styles.goldText}>{elem}</Text>
						</Row>
					</TouchFeedback>
				</View>
			);
		});
	}

	renderCustomExchangeValue() {
		let { ticket } = this.state;
		let { exchangeRate } = this.props;
		return (
			<View style={styles.valueItem}>
				<Row>
					<Image source={require('../../assets/images/heart.png')} style={styles.heartIcon} />
					<CustomTextInput
						style={styles.inputStyle}
						onChangeText={this.onChangeText}
						keyboardType="numeric"
						value={ticket}
						placeholder={'自定义兑换量'}
						onFocus={this.onKeyboardShow}
					/>
				</Row>
				<TouchFeedback style={styles.exchangeButton} onPress={() => this.onExchange(ticket)}>
					<Row>
						<Iconfont name="diamond" size={PxFit(14)} color={'#fff'} />
						<Text style={styles.goldText}>{ticket || '自定义'}</Text>
					</Row>
				</TouchFeedback>
			</View>
		);
	}

	render() {
		let { ticket } = this.state;
		let { navigation, user } = this.props;
		return (
			<Query query={UserQuery} variables={{ id: user.id }}>
				{({ data, loading, error, refetch }) => {
					if (error) return null;
					if (!(data && data.user)) return null;
					let user = data.user;
					let progress = (user.ticket / user.level.ticket_max) * 100 + '%';
					this.ticketMax = user.level.ticket_max;
					return (
						<PageContainer white title="补充精力">
							<ScrollView
								ref={ref => (this._scrollView = ref)}
								contentContainerStyle={{ flexGrow: 1, paddingHorizontal: PxFit(Theme.itemSpace) }}
								keyboardShouldPersistTaps="always"
								showsVerticalScrollIndicator={false}
								bounces={false}
							>
								<View style={styles.userTicket}>
									<Text style={styles.remainTicket}>剩余智慧点</Text>
									<Row>
										<Image
											source={require('../../assets/images/heart.png')}
											style={styles.ticketImageLg}
										/>
										<Text style={styles.ticketCount}>{user.ticket}</Text>
									</Row>
								</View>
								<View style={styles.ticketReview}>
									<Row style={{ justifyContent: 'space-between' }}>
										<Text style={styles.subTitle}>精力上限</Text>
										<TouchFeedback onPress={() => navigation.navigate('GradeDescription')}>
											<Row>
												<Text style={styles.viewMore}>查看详情</Text>
												<Iconfont name="right" size={PxFit(14)} color={Theme.subTextColor} />
											</Row>
										</TouchFeedback>
									</Row>
									<View style={styles.ticketUpperLimit}>
										<View style={[styles.ticketBar, { width: progress }]} />
									</View>
									<Row style={{ justifyContent: 'space-between' }}>
										<Text style={styles.greyText}>Lv.{user.level.level}</Text>
										<Text style={styles.greyText}>
											({user.ticket ? user.ticket : '0'}/
											{user.level ? user.level.ticket_max : '180'})
										</Text>
									</Row>
								</View>
								<View>
									<Row style={styles.exchangeTitle}>
										<Text style={styles.subTitle}>兑换精力</Text>
										<Text style={styles.tipText}>*精力会在第二天重置</Text>
									</Row>
									<View>
										{this.renderExchangeValue()}
										{this.renderCustomExchangeValue()}
									</View>
								</View>
							</ScrollView>
						</PageContainer>
					);
				}}
			</Query>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f9f9f9'
	},
	userTicket: {
		paddingBottom: PxFit(25),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	remainTicket: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		marginVertical: PxFit(Theme.itemSpace)
	},
	ticketImageLg: {
		width: PxFit(24),
		height: PxFit(26),
		marginRight: PxFit(8)
	},
	ticketCount: {
		fontSize: PxFit(22),
		fontWeight: '500',
		color: Theme.primaryColor
	},
	ticketReview: {
		paddingVertical: PxFit(25),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	subTitle: {
		fontSize: PxFit(14),
		color: Theme.defaultTextColor
	},
	viewMore: {
		fontSize: PxFit(14),
		color: Theme.subTextColor,
		marginRight: PxFit(3)
	},
	ticketUpperLimit: {
		marginTop: PxFit(15),
		height: PxFit(6),
		borderRadius: PxFit(3),
		backgroundColor: '#f0f0f0',
		overflow: 'hidden'
	},
	ticketBar: {
		alignSelf: 'auto',
		flex: 1,
		backgroundColor: '#12E2BB'
	},
	greyText: {
		fontSize: PxFit(12),
		color: Theme.subTextColor,
		marginTop: PxFit(3)
	},
	exchangeTitle: {
		justifyContent: 'space-between',
		marginVertical: PxFit(20)
	},
	exchangeText: {
		fontSize: PxFit(14),
		color: Theme.defaultTextColor
	},
	tipText: {
		fontSize: PxFit(13),
		color: Theme.secondaryColor
	},
	valueItem: {
		marginBottom: PxFit(25),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	heartIcon: {
		width: PxFit(20),
		height: PxFit(22),
		marginRight: PxFit(10)
	},
	valueItemText: {
		fontSize: PxFit(14),
		color: Theme.defaultTextColor
	},
	exchangeButton: {
		width: PxFit(88),
		height: PxFit(32),
		borderRadius: PxFit(6),
		backgroundColor: Theme.primaryColor,
		justifyContent: 'center',
		alignItems: 'center'
	},
	goldText: {
		fontSize: PxFit(14),
		color: '#fff',
		marginLeft: PxFit(2),
		marginBottom: PxFit(1)
	},
	inputStyle: {
		width: PxFit(108),
		height: PxFit(32),
		borderWidth: PxFit(1),
		borderRadius: PxFit(4),
		borderColor: '#f0f0f0',
		paddingHorizontal: PxFit(10),
		backgroundColor: '#f9f9f9',
		fontSize: PxFit(14),
		color: Theme.defaultTextColor
	}
});

export default connect(store => {
	return { user: store.users.user };
})(ChargeTicket);
