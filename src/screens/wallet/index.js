/*
 * @flow
 * created by wyk made in 2019-03-22 12:02:46
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import { PageContainer, Iconfont, TouchFeedback, Button, SubmitLoading, PopOverlay, Row } from '../../components';

import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, WPercent, Tools } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Storage, ItemKeys } from '../../store/localStorage';

import { WithdrawsQuery } from '../../assets/graphql/withdraws.graphql';
import { UserQuery } from '../../assets/graphql/User.graphql';
import { Mutation, Query, compose, graphql } from 'react-apollo';

import { Overlay } from 'teaset';

import RuleDescription from './components/RuleDescription';

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clickControl: false,
			isVisible: false,
			userCache: {
				gold: 0,
				gold_amount: 0,
				transaction_sum_amount: 0
			}
		};
	}

	componentDidMount() {
		if (this.props.login) {
			this.loadCache();
		}
	}

	async loadCache() {
		let userCache = await Storage.getItem(ItemKeys.userCache);
		if (userCache) {
			this.setState({
				userCache
			});
		}
	}

	showRule = () => {
		let overlayView = (
			<Overlay.View animated>
				<View style={styles.overlayInner}>
					<RuleDescription hide={() => Overlay.hide(this.OverlayKey)} />
				</View>
			</Overlay.View>
		);
		this.OverlayKey = Overlay.show(overlayView);
	};

	render() {
		let { clickControl, isVisible, userCache } = this.state;
		const { user, navigation } = this.props;
		return (
			<Query query={UserQuery} variables={{ id: user.id }}>
				{({ data, loading, error, refetch }) => {
					let user = Tools.syncGetter('user', data);
					if (!user) {
						user = userCache;
					}
					return (
						<PageContainer
							title="钱袋"
							isTopNavigator
							onDidFocus={refetch}
							rightView={
								<TouchFeedback onPress={this.showRule} style={styles.rule}>
									<Iconfont name={'question'} size={PxFit(19)} color={'#fff'} />
								</TouchFeedback>
							}
						>
							<View style={styles.container}>
								<View style={styles.walletPanel}>
									<View style={styles.statistics}>
										<View style={styles.currentGold}>
											<Text style={styles.greyText1}>当前智慧点(个)</Text>
											<Text style={styles.boldBlackText}>{user.gold || 0}</Text>
										</View>
										<View style={styles.accumulat}>
											<View style={styles.accumulated}>
												<Text style={styles.greyText2}>累计智慧点(个)</Text>
												<Text style={styles.slenderBlackText}>{user.gold_amount || 2000}</Text>
											</View>
											<View style={styles.line} />
											<View style={styles.accumulated}>
												<Text style={styles.greyText2}>累计收益(元)</Text>
												<Text style={styles.slenderBlackText}>
													{user.transaction_sum_amount || 1}
												</Text>
											</View>
										</View>
									</View>
									<View style={styles.buttonWrap}>
										<TouchFeedback
											style={[styles.button, styles.withdrawButton]}
											onPress={() => navigation.navigate('Withdraws')}
										>
											<Text style={styles.withdrawText}>提现</Text>
										</TouchFeedback>
										<TouchFeedback
											style={[styles.button, styles.toUpButton]}
											onPress={() => navigation.navigate('TopUp', { user })}
										>
											<Text style={styles.toUpText}>充值</Text>
										</TouchFeedback>
									</View>
								</View>
								<View style={styles.feature}>
									<TouchFeedback
										style={styles.columnItem}
										authenticated
										navigation={navigation}
										onPress={() => navigation.navigate('IncomeAndExpenditure')}
									>
										<Row>
											<Iconfont
												name={'order-fill'}
												size={PxFit(22)}
												style={styles.itemType}
												color={Theme.primaryColor}
											/>
											<Text style={styles.itemTypeText}>收支明细</Text>
										</Row>
										<Iconfont name="right" size={17} color={Theme.subTextColor} />
									</TouchFeedback>
									<TouchFeedback
										style={styles.columnItem}
										authenticated
										navigation={navigation}
										onPress={() => navigation.navigate('ChargeTicket')}
									>
										<Row>
											<Iconfont
												name={'like-fill'}
												size={PxFit(24)}
												style={styles.itemType}
												color={Theme.secondaryColor}
											/>
											<Text style={styles.itemTypeText}>精力补充</Text>
										</Row>
										<Iconfont name="right" size={17} color={Theme.subTextColor} />
									</TouchFeedback>
								</View>
							</View>
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
	rule: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	walletPanel: {
		padding: PxFit(Theme.itemSpace),
		backgroundColor: '#fff'
	},
	statistics: {
		marginTop: PxFit(Theme.itemSpace)
	},
	currentGold: {
		alignItems: 'center'
	},
	greyText1: {
		fontSize: PxFit(13),
		color: Theme.subTextColor
	},
	boldBlackText: {
		marginTop: PxFit(15),
		marginBottom: PxFit(5),
		fontSize: PxFit(30),
		fontWeight: '500',
		lineHeight: PxFit(32),
		color: Theme.defaultTextColor
	},
	accumulat: {
		marginVertical: PxFit(Theme.itemSpace),
		flexDirection: 'row'
	},
	accumulated: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	line: {
		alignSelf: 'stretch',
		width: PxFit(1),
		backgroundColor: '#f0f0f0'
	},
	greyText2: {
		fontSize: PxFit(11),
		color: Theme.subTextColor
	},
	slenderBlackText: {
		marginTop: PxFit(10),
		fontSize: PxFit(17),
		lineHeight: PxFit(18),
		fontWeight: '300',
		color: Theme.defaultTextColor
	},
	buttonWrap: {
		marginVertical: PxFit(Theme.itemSpace),
		flexDirection: 'row'
	},
	button: {
		flex: 1,
		height: PxFit(46),
		borderRadius: PxFit(4),
		alignItems: 'center',
		justifyContent: 'center'
	},
	withdrawButton: {
		backgroundColor: '#f0f0f0',
		marginRight: PxFit(5)
	},
	toUpButton: {
		backgroundColor: Theme.primaryColor,
		marginLeft: PxFit(5)
	},
	withdrawText: {
		fontSize: PxFit(16),
		color: '#b6c2e1'
	},
	toUpText: {
		fontSize: PxFit(16),
		color: '#fff'
	},
	feature: {
		flex: 1,
		marginTop: PxFit(8)
	},
	columnItem: {
		height: PxFit(52),
		paddingHorizontal: Theme.itemSpace,
		borderBottomWidth: PxFit(0.5),
		borderColor: Theme.borderColor,
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	itemTypeText: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor
	},
	itemType: {
		width: PxFit(25),
		textAlign: 'center',
		justifyContent: 'center',
		marginRight: PxFit(10)
	},
	overlayInner: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default connect(store => ({
	user: store.users.user,
	login: store.users.login
}))(index);
