/*
 * @Author: Gaoxuan
 * @Date:   2019-03-27 11:52:27
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button, PageContainer, SubmitLoading, CustomTextInput, KeyboardSpacer } from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from '../../utils';

import { Mutation, compose, graphql, GQL } from 'apollo';
import { app } from 'store';

class VerificationPhone extends Component {
	constructor(props) {
		super(props);
		let { time } = this.props.navigation.state.params;
		this.time_remaining = time ? time - 1 : 60;
		this.state = {
			tips: this.time_remaining + 's后重新发送',
			verificationCode: null,
			submitting: false,
			password: null,
		};
	}
	componentDidMount() {
		this.countDown();
	}

	componentWillUpdate(nextProps, nextState) {
		if (this.time_remaining == 60) {
			this.timer && clearInterval(this.timer);
		}
	}

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	countDown = () => {
		this.timer = setInterval(() => {
			--this.time_remaining;
			if (this.time_remaining == 0) {
				this.time_remaining = 60;
				this.setState({
					tips: '重新获取验证码',
				});
				return;
			}
			this.setState({
				tips: this.time_remaining + 's后重新发送',
			});
		}, 1000);
	};

	//重新发送验证码
	resendVerificationCode = async () => {
		let result = {};
		this.time_remaining = 59;
		let { phone } = navigation.state.params;
		this.setState({
			tips: '59s后重新发送',
		});
		try {
			result = await this.props.SendVerificationCodeMutation({
				variables: {
					account: phone,
					action: 'USER_LOGIN',
				},
				errorPolicy: 'all',
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			let str = result.errors[0].message;
			Toast.show({ content: str });
		} else {
			this.props.navigation.setParams({
				code: result.data.sendVerificationCode.code,
			});
			this.countDown();
		}
	};

	//提交密码登录
	setPassword = async () => {
		let { verificationCode, password } = this.state;
		const { navigation } = this.props;
		const { code, phone, data } = navigation.state.params;
		let result = {};

		this.setState({
			submitting: true,
		});

		try {
			result = await this.props.signInMutation({
				variables: {
					account: phone,
					password: password,
					code: verificationCode,
				},
				errorPolicy: 'all',
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			this.setState({
				submitting: false,
			});
			let str = result.errors[0].message;
			Toast.show({ content: str });
		} else {
			const user = result.data.signIn;
			this._saveUserData(user, data);
			Toast.show({ content: '设置成功' });
		}
		this.setState({
			code: '',
		});

		this.setState({
			submitting: false,
		});
	};

	//保存用户信息
	_saveUserData = (user, data) => {
		app.signIn(user);
		if (data) {
			this.bindWechat();
		}
		this.props.navigation.navigate('答题', {
			has_reward_new_user: user.has_reward_new_user,
		});
	};

	//绑定微信
	bindWechat = async () => {
		const { navigation } = this.props;
		const { data } = navigation.state.params;
		let result = {};

		try {
			result = await this.props.BindWechatMutation({
				variables: {
					union_id: data.unionid,
				},
				errorPolicy: 'all',
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			this.setState({
				submitting: false,
			});
			let str = result.errors[0].message;
			Toast.show({ content: str });
		} else {
			this.setState({
				submitting: false,
			});
			Toast.show({ content: '登录成功' });
		}
	};

	render() {
		const { navigation } = this.props;
		let { verificationCode, tips, submitting, password } = this.state;
		let { phone } = navigation.state.params;
		return (
			<PageContainer title="验证手机号" white submitting={submitting} submitTips="验证中...">
				<View style={styles.container}>
					<View style={styles.header}>
						{/*	<Text style={styles.title}>支付宝信息</Text>*/}
						<Text style={styles.tipsText}>验证码已发送至{phone}</Text>
						<Text style={styles.tipsText}>设置密码后，你可以使用该手机号+密码登录</Text>
					</View>
					<View style={styles.textWrap}>
						<CustomTextInput
							placeholder="请输入收到的验证码"
							style={{ height: PxFit(48) }}
							defaultValue={this.state.verificationCode}
							maxLength={6}
							autoFocus
							keyboardType={'numeric'}
							onChangeText={value => {
								this.setState({
									verificationCode: value,
								});
							}}
						/>
					</View>
					<View style={styles.textWrap}>
						<CustomTextInput
							placeholder="请输入密码"
							style={{ height: PxFit(48) }}
							secureTextEntry={true}
							onChangeText={value => {
								this.setState({
									password: value,
								});
							}}
							maxLength={48}
						/>
					</View>

					<View style={styles.buttonWrap}>
						<Button
							title="完成"
							onPress={this.setPassword}
							style={styles.button}
							disabled={verificationCode && password ? false : true}
						/>
					</View>
					<View style={styles.footer}>
						<TouchableOpacity onPress={this.resendVerificationCode} disabled={!(this.time_remaining == 60)}>
							<Text
								style={{
									color: this.time_remaining == 60 ? Theme.primaryColor : Theme.grey,
									fontSize: PxFit(13),
								}}>
								{tips}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</PageContainer>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.white,
	},
	header: {
		marginTop: PxFit(30),
		paddingHorizontal: PxFit(25),
		marginBottom: 15,
	},
	title: {
		color: Theme.black,
		fontSize: PxFit(20),
		fontWeight: '600',
	},
	tipsText: {
		color: Theme.grey,
		fontSize: PxFit(12),
		paddingTop: PxFit(20),
	},
	buttonWrap: {
		marginHorizontal: PxFit(25),
		marginTop: PxFit(35),
		height: PxFit(48),
	},
	button: {
		height: PxFit(42),
		fontSize: PxFit(16),
		backgroundColor: Theme.primaryColor,
		borderRadius: PxFit(21),
	},
	textWrap: {
		marginHorizontal: PxFit(25),
		paddingHorizontal: 0,
		// marginTop: PxFit(2),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.lightBorder,
	},
	textInput: {
		fontSize: PxFit(16),
		color: Theme.primaryFont,
		padding: 0,
		height: PxFit(50),
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: PxFit(25),
		marginTop: PxFit(15),
	},
});

export default compose(
	graphql(GQL.signInMutation, { name: 'signInMutation' }),
	graphql(GQL.SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' }),
	graphql(GQL.BindWechatMutation, { name: 'BindWechatMutation' }),
)(VerificationPhone);
