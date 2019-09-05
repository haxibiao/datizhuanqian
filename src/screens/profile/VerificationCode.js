/*
 * @Author: Gaoxuan
 * @Date:   2019-03-27 11:52:27
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button, PageContainer, SubmitLoading, CustomTextInput, KeyboardSpacer } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from 'utils';

import { Mutation, compose, graphql, GQL } from 'apollo';
import { app } from 'store';

class VerificationCode extends Component {
	constructor(props) {
		super(props);
		let { time } = this.props.navigation.state.params;
		this.time_remaining = time ? time - 1 : 60;
		this.state = {
			tips: this.time_remaining + 's后重新发送',
			verificationCode: null,
			submitting: false,
			real_name: null,
			pay_account: null
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
					tips: '重新获取验证码'
				});
				return;
			}
			this.setState({
				tips: this.time_remaining + 's后重新发送'
			});
		}, 1000);
	};

	//重新发送验证码
	resendVerificationCode = async () => {
		let result = {};
		this.time_remaining = 59;
		this.setState({
			tips: '59s后重新发送'
		});
		try {
			result = await this.props.SendVerificationCodeMutation({
				variables: {
					account: app.me.account,
					action: 'USER_INFO_CHANGE'
				},
				errorPolicy: 'all'
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			let str = result.errors[0].message;
			Toast.show({ content: str });
		} else {
			this.props.navigation.setParams({
				code: result.data.sendVerificationCode.code
			});
			this.countDown();
		}
	};

	//提交设置支付宝
	setPaymentInfo = async () => {
		let { verificationCode, real_name, pay_account } = this.state;
		const { navigation } = this.props;
		const { code } = navigation.state.params;
		let result = {};

		if (Tools.regular(this.state.pay_account)) {
			if (code == verificationCode) {
				this.setState({
					submitting: true
				});
				try {
					result = await this.props.SetUserPaymentInfoMutation({
						variables: {
							real_name: real_name,
							pay_account: pay_account,
							code: code
						},
						errorPolicy: 'all'
					});
				} catch (ex) {
					result.errors = ex;
				}
				if (result && result.errors) {
					this.setState({
						submitting: false
					});
					let str = result.errors[0].message;
					Toast.show({ content: str });
				} else {
					this.setState({
						submitting: false
					});
					navigation.pop(2);
					Toast.show({ content: '修改成功' });
				}
				this.setState({
					pay_account: ''
				});
			} else {
				Toast.show({ content: '验证码错误' });
			}
		} else {
			Toast.show({ content: '支付宝格式错误' });
		}
	};

	render() {
		const { navigation } = this.props;
		let { verificationCode, tips, submitting, pay_account, real_name } = this.state;
		return (
			<PageContainer title="验证" white submitting={submitting} submitTips="验证中...">
				<View style={styles.container}>
					<View style={styles.header}>
						<Text style={styles.title}>支付宝信息</Text>
						{/*<Text style={styles.tipsText}>验证码已发送至 账号{app.me.account}</Text>*/}
						<Text style={styles.tipsText}>
							支付宝账号以及真实姓名为提现有效证据,请输入已经通过实名认证的支付宝账号,否则提现将失败.
						</Text>
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
									verificationCode: value
								});
							}}
						/>
					</View>
					<View style={styles.textWrap}>
						<CustomTextInput
							style={{ height: PxFit(48) }}
							placeholder={'请输入真实姓名'}
							onChangeText={value => {
								this.setState({
									real_name: value
								});
							}}
							maxLength={8}
						/>
					</View>
					<View style={styles.textWrap}>
						<CustomTextInput
							placeholder="请输入支付宝账号"
							style={{ height: PxFit(48) }}
							onChangeText={value => {
								this.setState({
									pay_account: value
								});
							}}
							maxLength={48}
						/>
					</View>

					<View style={styles.buttonWrap}>
						<Button
							title="保存"
							onPress={this.setPaymentInfo}
							style={styles.button}
							disabled={verificationCode && pay_account && real_name ? false : true}
						/>
					</View>
					<View style={styles.footer}>
						<TouchableOpacity onPress={this.resendVerificationCode} disabled={!(this.time_remaining == 60)}>
							<Text
								style={{
									color: this.time_remaining == 60 ? Theme.primaryColor : Theme.grey,
									fontSize: PxFit(13)
								}}
							>
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
		backgroundColor: Theme.white
	},
	header: {
		marginTop: PxFit(30),
		paddingHorizontal: PxFit(25),
		marginBottom: 15
	},
	title: {
		color: Theme.black,
		fontSize: PxFit(20),
		fontWeight: '600'
	},
	tipsText: {
		color: Theme.grey,
		fontSize: PxFit(12),
		paddingTop: PxFit(20)
	},
	buttonWrap: {
		marginHorizontal: PxFit(25),
		marginTop: PxFit(35),
		height: PxFit(48)
	},
	button: {
		height: PxFit(38),
		fontSize: PxFit(16),
		backgroundColor: Theme.primaryColor,
		borderRadius: PxFit(5)
	},
	textWrap: {
		marginHorizontal: PxFit(25),
		paddingHorizontal: 0,
		// marginTop: PxFit(2),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.lightBorder
	},
	textInput: {
		fontSize: PxFit(16),
		color: Theme.primaryFont,
		padding: 0,
		height: PxFit(50)
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: PxFit(25),
		marginTop: PxFit(15)
	}
});

export default compose(
	graphql(GQL.SetUserPaymentInfoMutation, { name: 'SetUserPaymentInfoMutation' }),
	graphql(GQL.SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' })
)(VerificationCode);
