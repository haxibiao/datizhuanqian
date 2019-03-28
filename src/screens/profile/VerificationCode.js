/*
 * @Author: Gaoxuan
 * @Date:   2019-03-27 11:52:27
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button, PageContainer, SubmitLoading, CustomTextInput, KeyboardSpacer } from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { SetUserPaymentInfoMutation } from '../../assets/graphql/withdraws.graphql';
import { SendVerificationCodeMutation } from '../../assets/graphql/user.graphql';
import { Mutation, compose, graphql } from 'react-apollo';

class VerificationCode extends Component {
	constructor(props) {
		super(props);
		let { time } = this.props.navigation.state.params;
		this.time_remaining = time ? time - 1 : 60;
		this.state = {
			tips: this.time_remaining + 's后重新发送',
			verificationCode: null,
			isVisible: false
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
					account: this.props.users.user.account,
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
		let { verificationCode } = this.state;
		const { navigation } = this.props;
		const { code, accountInfo } = navigation.state.params;
		let result = {};

		if (code == verificationCode) {
			this.setState({
				isVisible: true
			});
			try {
				result = await this.props.SetUserPaymentInfoMutation({
					variables: {
						real_name: accountInfo.real_name,
						pay_account: accountInfo.pay_account,
						code: code
					},
					errorPolicy: 'all'
				});
			} catch (ex) {
				result.errors = ex;
			}
			console.log('result', result);
			if (result && result.errors) {
				this.setState({
					isVisible: false
				});
				let str = result.errors[0].message;
				Toast.show({ content: str });
			} else {
				this.setState({
					isVisible: false
				});
				this.props.dispatch(
					actions.updateAlipay({
						real_name: accountInfo.real_name,
						pay_account: accountInfo.pay_account
					})
				);
				navigation.pop(2);
				Toast.show({ content: '修改成功' });
			}
			this.setState({
				pay_account: ''
			});
		} else {
			Toast.show({ content: '验证码错误' });
		}
		this.setState({
			verificationCode: ''
		});
	};

	render() {
		const { navigation } = this.props;
		let { verificationCode, tips, isVisible } = this.state;
		return (
			<PageContainer title="验证" white>
				<View style={styles.container}>
					<View style={style.header}>
						<Text style={styles.title}>验证账号</Text>
						<Text style={styles.tipsText}>
							验证码已发送至
							<Text style={{ color: Theme.themeRed }}> 登录账号{this.props.users.user.account}</Text>
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

					<View style={styles.buttonWrap}>
						<Button
							title="确认"
							onPress={this.setPaymentInfo}
							style={styles.button}
							disabled={verificationCode ? false : true}
						/>
					</View>
					<View style={styles.footer}>
						<TouchableOpacity onPress={this.resendVerificationCode} disabled={!(this.time_remaining == 60)}>
							<Text
								style={{
									color: this.time_remaining == 60 ? Theme.theme : Theme.grey,
									fontSize: PxFit(13)
								}}
							>
								{tips}
							</Text>
						</TouchableOpacity>
						{/*<TouchableOpacity>
							<Text style={{ color: Theme.grey, fontSize: 13 }}>账号有误?</Text>
						</TouchableOpacity>*/}
					</View>
				</View>
				<SubmitLoading isVisible={isVisible} content={'验证中...'} />
				<KeyboardSpacer />
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
		marginTop: PxFit(50),
		paddingHorizontal: PxFit(25)
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
		backgroundColor: Theme.theme
	},
	textWrap: {
		marginHorizontal: PxFit(25),
		paddingHorizontal: 0,
		marginTop: PxFit(30),
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

export default connect(store => store)(
	compose(
		graphql(SetUserPaymentInfoMutation, { name: 'SetUserPaymentInfoMutation' }),
		graphql(SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' })
	)(VerificationCode)
);
