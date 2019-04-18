/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:32
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, PopOverlay, Button, CustomTextInput } from '../../components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Storage, ItemKeys } from '../../store/localStorage';
import { Query, withApollo, compose, graphql } from 'react-apollo';
import {
	signUpMutation,
	signInMutation,
	UserQuery,
	SendVerificationCodeMutation
} from '../../assets/graphql/user.graphql';

import { BoxShadow } from 'react-native-shadow';

const shadowOpt = {
	width: SCREEN_WIDTH - Theme.itemSpace * 3,
	color: '#E8E8E8',
	border: PxFit(3),
	radius: PxFit(10),
	opacity: 0.5,
	x: 0,
	y: 1,
	style: {
		marginTop: 0
	}
};
var showThumbType = ['accpunt', 'password'];
class index extends Component {
	constructor(props) {
		super(props);
		this.timeRemaining = 60;
		this.state = {
			phone: true,
			submitting: false,
			account: null,
			password: null,
			showThumb: false,
			secure: true,
			countdown: 0
		};
	}

	checkNetwork = childState => {
		NetInfo.isConnected.fetch().then(isConnected => {
			if (isConnected) {
				this.onSubmit();
			} else {
				Methods.toast('请检查是否连接网络', 80);
			}
		});
	};

	getVerificationCode = async () => {
		let { account } = this.state;
		try {
			let result = await this.props.SendVerificationCodeMutation({
				variables: {
					account: account,
					action: 'USER_LOGIN'
				},
				errorPolicy: 'all'
			});
			this.verificationCode = result.data.sendVerificationCode.code;
			this.timeRemaining = result.data.sendVerificationCode.surplusSecond;
			this.countdown();
		} catch (error) {
			let str = errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str, layout: 'top' });
		}
	};

	countdown() {
		this.setState(
			prevState => ({ countdown: --this.timeRemaining }),
			() => {
				if (this.timeRemaining === 0) {
					clearTimeout(this.timer);
				}
			}
		);
		this.timer = setTimeout(() => {
			this.countdown();
		}, 1000);
	}

	//处理表单提交
	onSubmit = async () => {
		const { phone, account, password } = this.state;
		this.setState({
			submitting: true
		});
		let result = {};
		try {
			result = await this.props.signInMutation({
				variables: {
					account,
					password: phone ? undefined : password,
					code: phone ? password : undefined
				}
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str, layout: 'top' });
		} else {
			const user = result.data.signIn;
			this._saveUserData(user);
		}
		this.setState({
			submitting: false
		});
	};

	_saveUserData = user => {
		this.props.dispatch(actions.signIn(user));
		this.props.navigation.goBack();
	};

	changeAccount = value => {
		this.setState({ account: value });
	};

	changePassword = value => {
		this.setState({ password: value });
	};

	toggleMutation = () => {
		this.setState(prevState => ({
			phone: !prevState.phone,
			account: null,
			password: null
		}));
	};

	validator(number) {
		console.log('number', number);
		if (String(number).length === 11) {
			return true;
		}
		return false;
	}

	render() {
		let { navigation } = this.props;
		let { phone, submitting, account, password, showThumb, secure, countdown } = this.state;
		let disabled = !(account && password);
		return (
			<PageContainer
				submitting={submitting}
				contentViewStyle={{ marginTop: 0 }}
				navBarStyle={{ zIndex: 1, backgroundColor: 'transparent' }}
				leftView={
					<TouchFeedback onPress={() => this.props.navigation.pop()}>
						<Iconfont name="close" size={PxFit(24)} color={Theme.primaryColor} />
					</TouchFeedback>
				}
			>
				<View style={styles.container} bounces={false}>
					<View style={styles.registerCoverContainer}>
						<Image
							source={
								SCREEN_HEIGHT / SCREEN_WIDTH >= 2
									? require('../../assets/images/register_cover_2.png')
									: require('../../assets/images/register_cover_1.png')
							}
							style={styles.registerCover}
						/>
					</View>
					<BoxShadow
						setting={Object.assign({}, shadowOpt, {
							height: PxFit(320)
						})}
					>
						<View style={styles.formContainer}>
							<View style={{ width: '80%' }}>
								<View>
									<View style={styles.fieldGroup}>
										<Text style={styles.field}>{phone ? '手机号' : '账号'}</Text>
										<View
											style={[
												styles.inputWrap,
												showThumb == showThumbType[0] && { borderBottomColor: '#f79b7c' }
											]}
										>
											<CustomTextInput
												placeholderTextColor={Theme.subTextColor}
												autoCorrect={false}
												placeholder={phone ? '请输入手机号' : '请输入账号'}
												style={styles.inputStyle}
												value={account}
												onChangeText={this.changeAccount}
												onFocus={() => this.setState({ showThumb: showThumbType[0] })}
											/>

											{showThumb == showThumbType[0] && (
												<TouchFeedback onPress={() => this.changeAccount('')}>
													<Iconfont
														name={'close'}
														size={PxFit(20)}
														color={Theme.tintTextColor}
													/>
												</TouchFeedback>
											)}
										</View>
									</View>
									<View style={styles.fieldGroup}>
										<Text style={styles.field}>{phone ? '验证码' : '密码'}</Text>
										<View
											style={[
												styles.inputWrap,
												showThumb == showThumbType[1] && { borderBottomColor: '#f79b7c' }
											]}
										>
											<CustomTextInput
												placeholderTextColor={Theme.subTextColor}
												autoCorrect={false}
												placeholder={phone ? '请输入验证码' : '请输入密码'}
												secureTextEntry={phone ? false : secure}
												style={styles.inputStyle}
												value={password}
												onChangeText={this.changePassword}
												onFocus={() => this.setState({ showThumb: showThumbType[1] })}
											/>

											{phone && (
												<TouchFeedback
													onPress={this.getVerificationCode}
													style={[
														styles.countdown,
														this.validator(account) && {
															backgroundColor: Theme.primaryColor
														}
													]}
													disabled={!this.validator(account)}
												>
													<Text
														style={[
															styles.countdownText,
															this.validator(account) && { color: '#fff' }
														]}
													>
														{countdown > 0 ? countdown : '获取验证码'}
													</Text>
												</TouchFeedback>
											)}
											{!phone && showThumb == showThumbType[1] && (
												<TouchFeedback onPress={() => this.setState({ secure: !secure })}>
													<Iconfont
														name={secure ? 'eye' : 'hide'}
														size={PxFit(20)}
														color={secure ? Theme.tintTextColor : Theme.secondaryTextColor}
													/>
												</TouchFeedback>
											)}
										</View>
									</View>
								</View>
								<Button style={styles.button} disabled={disabled} onPress={this.checkNetwork}>
									<Text style={styles.buttonText}>{phone ? '登录/注册' : '登 录'}</Text>
								</Button>
								<View style={styles.bottomInfo}>
									<TouchFeedback onPress={this.toggleMutation}>
										<Text style={styles.bottomLinkText}>
											{phone ? '账号密码登录' : '验证码登录'}
										</Text>
									</TouchFeedback>
									{!phone && (
										<TouchFeedback onPress={() => navigation.navigate('ForgetPassword')}>
											<Text style={styles.bottomInfoText}>忘记密码?</Text>
										</TouchFeedback>
									)}
								</View>
							</View>
						</View>
					</BoxShadow>
				</View>
				<Row style={styles.protocol}>
					<Text style={styles.bottomInfoText}>登录代表你已同意</Text>
					<TouchFeedback onPress={() => navigation.navigate('UserProtocol')}>
						<Text style={styles.bottomLinkText}>《用户协议》</Text>
					</TouchFeedback>
				</Row>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	registerCoverContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	},
	registerCover: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: null,
		height: null
	},
	// registerCover: {
	// 	height: PxFit(150),
	// 	paddingTop: PxFit(Theme.statusBarHeight + 20),
	// 	backgroundColor: Theme.primaryColor
	// },
	formContainer: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: PxFit(10)
	},
	fieldGroup: {
		marginBottom: PxFit(10)
	},
	field: {
		fontSize: PxFit(16),
		color: '#666'
	},
	inputWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	inputStyle: {
		flex: 1,
		height: PxFit(40),
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		paddingBottom: PxFit(10),
		paddingTop: PxFit(10)
	},
	countdown: {
		width: PxFit(64),
		height: PxFit(20),
		borderRadius: PxFit(4),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f0f0f0'
	},
	countdownText: {
		fontSize: PxFit(10),
		color: Theme.subTextColor
	},
	button: {
		marginTop: PxFit(30),
		height: PxFit(40),
		backgroundColor: Theme.primaryColor
	},
	buttonText: {
		fontSize: PxFit(16),
		fontWeight: '500',
		color: '#fff'
	},
	bottomInfo: {
		marginTop: PxFit(20),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	bottomInfoText: {
		fontSize: PxFit(14),
		color: Theme.subTextColor
	},
	bottomLinkText: {
		fontSize: PxFit(14),
		color: '#F79B7C'
	},
	protocol: {
		position: 'absolute',
		bottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(Theme.itemSpace),
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default compose(
	withApollo,
	connect(store => {
		return { users: store.users };
	}),
	graphql(signUpMutation, { name: 'signUpMutation' }),
	graphql(signInMutation, { name: 'signInMutation' }),
	graphql(SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' })
)(index);
