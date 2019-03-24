/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:32
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, PopOverlay, Button, CustomTextInput } from '../../components';
import { Theme, PxFit, SCREEN_WIDTH } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Storage, ItemKeys } from '../../store/localStorage';
import { Query, withApollo, compose, graphql } from 'react-apollo';
import { signUpMutation, signInMutation, UserQuery } from '../../assets/graphql/user.graphql';

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
		let signIn = props.navigation.getParam('signIn', true);
		this.state = {
			signIn,
			modalShow: false,
			account: null,
			password: null,
			showThumb: false,
			secure: true,
			agreement: true
		};
	}

	//处理表单提交
	onSubmit = async () => {
		const { account, password } = this.state;
		this.setState({
			modalShow: true
		});
		if (this.state.signIn) {
			//登录
			let result = {};
			try {
				result = await this.props.signInMutation({
					variables: {
						account,
						password
					}
				});
			} catch (ex) {
				result.errors = ex;
			}
			if (result && result.errors) {
				let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
				Toast.show({ content: str, layout: 'top' }); //Toast错误信息
			} else {
				const user = result.data.signIn;
				this._saveUserData(user);
			}
			this.setState({
				modalShow: false
			});
		} else {
			//注册
			let result = {};
			try {
				result = await this.props.signUpMutation({
					variables: {
						account,
						password
					}
				});
			} catch (ex) {
				result.errors = ex;
			}
			if (result && result.errors) {
				let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
				Toast.show({ content: str, layout: 'top' }); //Toast错误信息
			} else {
				const user = result.data.signUp;
				this._saveUserData(user);
			}
			this.setState({
				modalShow: false
			});
		}
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
			signIn: !prevState.signIn,
			account: null,
			password: null
		}));
	};

	render() {
		let { navigation } = this.props;
		let { signIn, modalShow, account, password, showThumb, secure, agreement } = this.state;
		let disabled = signIn ? !(account && password) : !(account && password && agreement);
		return (
			<PageContainer
				loading={modalShow}
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
							source={require('../../assets/images/register_cover_2.png')}
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
										<Text style={styles.field}>账号</Text>
										<View
											style={[
												styles.inputWrap,
												showThumb == showThumbType[0] && { borderBottomColor: '#f79b7c' }
											]}
										>
											<CustomTextInput
												placeholderTextColor={Theme.subTextColor}
												autoCorrect={false}
												placeholder="请输入手机号/邮箱"
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
														color={
															secure ? Theme.tintTextColor : Theme.primaryAuxiliaryColor
														}
													/>
												</TouchFeedback>
											)}
										</View>
									</View>
									<View style={styles.fieldGroup}>
										<Text style={styles.field}>密码</Text>
										<View
											style={[
												styles.inputWrap,
												showThumb == showThumbType[1] && { borderBottomColor: '#f79b7c' }
											]}
										>
											<CustomTextInput
												placeholderTextColor={Theme.subTextColor}
												autoCorrect={false}
												placeholder="请输入密码"
												secureTextEntry={secure}
												style={styles.inputStyle}
												value={password}
												onChangeText={this.changePassword}
												onFocus={() => this.setState({ showThumb: showThumbType[1] })}
											/>
											{showThumb == showThumbType[1] && (
												<TouchFeedback onPress={() => this.setState({ secure: !secure })}>
													<Iconfont
														name={secure ? 'eye' : 'hide'}
														size={PxFit(20)}
														color={
															secure ? Theme.tintTextColor : Theme.primaryAuxiliaryColor
														}
													/>
												</TouchFeedback>
											)}
										</View>
									</View>
								</View>
								<Button style={styles.button} disabled={disabled} onPress={this.onSubmit}>
									<Text style={styles.buttonText}>{signIn ? '登 录' : '注 册'}</Text>
								</Button>
								<View style={styles.bottomInfo}>
									{signIn ? (
										<TouchFeedback onPress={() => navigation.navigate('ForgerPassword')}>
											<Text style={styles.bottomInfoText}>忘记密码?</Text>
										</TouchFeedback>
									) : (
										<Row>
											<TouchFeedback
												onPress={() =>
													this.setState(prevState => ({
														agreement: !prevState.agreement
													}))
												}
											>
												<Image
													source={
														agreement
															? require('../../assets/images/check_fill.png')
															: require('../../assets/images/check.png')
													}
													style={{ width: PxFit(17), height: PxFit(17) }}
												/>
											</TouchFeedback>
											<Text style={styles.bottomInfoText}>同意</Text>
											<TouchFeedback onPress={() => navigation.navigate('UserProtocol')}>
												<Text style={styles.bottomLinkText}>《用户协议》</Text>
											</TouchFeedback>
										</Row>
									)}
									<TouchFeedback onPress={this.toggleMutation}>
										<Text style={styles.bottomLinkText}>{signIn ? '注册' : '登录'}</Text>
									</TouchFeedback>
								</View>
							</View>
						</View>
					</BoxShadow>
				</View>
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
		marginBottom: PxFit(8),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.borderColor
	},
	inputStyle: {
		flex: 1,
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		paddingVertical: PxFit(10)
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
	}
});

export default compose(
	withApollo,
	connect(store => {
		return { users: store.users };
	}),
	graphql(signUpMutation, { name: 'signUpMutation' }),
	graphql(signInMutation, { name: 'signInMutation' })
)(index);
