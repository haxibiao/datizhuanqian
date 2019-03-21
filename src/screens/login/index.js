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

import SignIn from './SignIn';
// import SignUp from './SignUp';

var showThumbType = ['accpunt', 'password'];
class index extends Component {
	constructor(props) {
		super(props);
		let login = props.navigation.getParam('login', true);
		this.state = {
			login,
			modalShow: false,
			account: null,
			password: null,
			showThumb: false,
			secure: true
		};
	}

	//处理表单提交
	onSubmit = async () => {
		const { account, password } = this.state;
		this.setState({
			modalShow: true
		});
		if (!this.state.login) {
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
				Methods.toast(str, 80); //Toast错误信息
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
				Methods.toast(str, 80); //Toast错误信息
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
			login: !prevState.login,
			account: null,
			password: null
		}));
	};

	render() {
		let { navigation } = this.props;
		let { login, modalShow, account, password, showThumb, secure } = this.state;
		let disabled = !(account && password);
		return (
			<PageContainer
				contentViewStyle={{ marginTop: 0 }}
				navBarStyle={{ zIndex: 1, backgroundColor: 'transparent' }}
				leftView={
					<TouchFeedback onPress={() => this.props.navigation.pop()}>
						<Iconfont name="close" size={PxFit(24)} color={'#fff'} />
					</TouchFeedback>
				}
			>
				<View style={styles.container} bounces={false}>
					<Image
						source={require('../../assets/images/register_cover.png')}
						style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.6 }}
					/>
					<View style={{ width: '76%' }}>
						<View>
							<View style={styles.fieldGroup}>
								<Text style={styles.field}>账号</Text>
								<View style={styles.inputWrap}>
									<CustomTextInput
										placeholderTextColor="#666"
										autoCorrect={false}
										placeholder="请输入邮箱号"
										keyboardType="email-address"
										style={styles.inputStyle}
										onChangeText={this.changeAccount}
										onFocus={() => this.setState({ showThumb: showThumbType[0] })}
									/>

									{showThumb == showThumbType[0] && (
										<TouchFeedback onPress={() => this.changeAccount('')}>
											<Iconfont
												name={'close'}
												size={PxFit(20)}
												color={secure ? Theme.tintTextColor : Theme.primaryAuxiliaryColor}
											/>
										</TouchFeedback>
									)}
								</View>
							</View>
							<View style={styles.fieldGroup}>
								<Text style={styles.field}>密码</Text>
								<View style={styles.inputWrap}>
									<CustomTextInput
										placeholderTextColor="#666"
										autoCorrect={false}
										placeholder="请输入密码"
										secureTextEntry={secure}
										style={styles.inputStyle}
										onChangeText={this.changePassword}
										onFocus={() => this.setState({ showThumb: showThumbType[1] })}
									/>
									{showThumb == showThumbType[1] && (
										<TouchFeedback onPress={() => this.setState({ secure: !secure })}>
											<Iconfont
												name={secure ? 'eye' : 'hide'}
												size={PxFit(20)}
												color={secure ? Theme.tintTextColor : Theme.primaryAuxiliaryColor}
											/>
										</TouchFeedback>
									)}
								</View>
							</View>
						</View>
						<Button style={styles.button} disabled={disabled} onPress={this.onSubmit}>
							<Text style={styles.buttonText}>{login ? '登 录' : '注 册'}</Text>
						</Button>
						<View style={styles.bottomInfo}>
							<TouchFeedback onPress={this.toggleMutation}>
								<Text style={styles.bottomLinkText}>{login ? '注册' : '登录'}</Text>
							</TouchFeedback>
							{login ? (
								<TouchFeedback onPress={() => navigation.navigate('ForgerPassword')}>
									<Text style={styles.bottomInfoText}>忘记密码</Text>
								</TouchFeedback>
							) : (
								<TouchFeedback>
									<Text style={styles.bottomInfoText}>同意《用户协议》</Text>
								</TouchFeedback>
							)}
						</View>
					</View>
				</View>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	registerCover: {
		height: PxFit(150),
		paddingTop: PxFit(Theme.statusBarHeight + 20),
		backgroundColor: Theme.primaryColor
	},
	fieldGroup: {
		marginBottom: PxFit(10)
	},
	field: {
		fontSize: PxFit(15),
		color: Theme.subTextColor
	},
	inputWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: PxFit(8),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.subTextColor
	},
	inputStyle: {
		flex: 1,
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		paddingTop: PxFit(12),
		paddingBottom: PxFit(12)
	},
	button: {
		marginVertical: PxFit(30),
		height: PxFit(40),
		backgroundColor: Theme.primaryColor
	},
	buttonText: {
		fontSize: PxFit(16),
		fontWeight: '500',
		color: '#fff'
	},
	bottomInfo: {
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
		color: Theme.linkColor
	}
});

export default compose(
	withApollo,
	connect(store => {
		return {
			user: store.users.user,
			login: store.users.login,
			isUpdate: store.users.isUpdate
		};
	}),
	graphql(signUpMutation, { name: 'signUpMutation' }),
	graphql(signInMutation, { name: 'signInMutation' })
)(index);
