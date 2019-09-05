/*
 * @Author: Gaoxuan
 * @Date:   2019-03-28 11:19:33
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Button, PageContainer, CustomTextInput, KeyboardSpacer, SubmitLoading } from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from '../../utils';

import { compose, graphql, GQL } from 'apollo';

let countDown = 59;

class RetrievePassword extends Component {
	constructor(props) {
		super(props);
		let { time } = this.props.navigation.state.params;
		this.time_remaining = time ? time - 1 : 60;
		this.state = {
			verificationCode: '',
			password: '',
			tips: `${this.time_remaining}s后重新发送`,
			disabled: true,
			submitting: false
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

	resendVerificationCode = async () => {
		let result = {};
		const { navigation } = this.props;
		const { account } = navigation.state.params;
		this.setState({
			submitting: true
		});
		try {
			result = await this.props.SendVerificationCodeMutation({
				variables: {
					account,
					action: 'RESET_PASSWORD'
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
			this.countDown();
			this.setState({
				submitting: false
			});
		}
	};

	//重置密码
	async resetPassword() {
		const { navigation } = this.props;
		let { verificationCode, password, disabled } = this.state;
		const { account } = navigation.state.params;
		let result = {};
		this.setState({
			submitting: true
		});
		try {
			result = await this.props.ResetPasswordMutation({
				variables: {
					account: account,
					password: password,
					code: verificationCode
				}
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			this.setState({
				submitting: false
			});
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str }); //打印错误信息
		} else {
			this.setState({
				submitting: false
			});
			Toast.show({ content: '新密码设置成功' });
			navigation.pop(2);
		}
	}

	render() {
		const { navigation } = this.props;
		let { verificationCode, password, disabled, tips, submitting } = this.state;

		return (
			<PageContainer title="重置密码" white submitting={submitting} submitTips="请稍后...">
				<View style={styles.header}>
					<Text style={{ color: Theme.black, fontSize: 20, fontWeight: '600' }}>设置新密码</Text>
				</View>
				<View style={styles.textWrap}>
					<CustomTextInput
						placeholder={'请输入验证码'}
						autoFocus
						style={{ height: PxFit(48) }}
						maxLength={6}
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
						placeholder={'请输入新密码'}
						style={{ height: PxFit(48) }}
						maxLength={32}
						secureTextEntry={true}
						onChangeText={value => {
							this.setState({
								password: value
							});
						}}
					/>
				</View>
				<TouchableOpacity
					style={{ marginHorizontal: PxFit(25), marginTop: PxFit(15) }}
					onPress={this.resendVerificationCode}
					disabled={!(this.time_remaining == 60)}
				>
					<Text style={{ color: this.time_remaining == 60 ? Theme.primaryColor : Theme.grey, fontSize: 13 }}>
						{tips}
					</Text>
				</TouchableOpacity>

				<Button
					title="完成"
					onPress={this.resetPassword.bind(this)}
					style={{
						height: PxFit(38),
						fontSize: PxFit(16),
						marginHorizontal: PxFit(25),
						marginTop: PxFit(30),
						backgroundColor: Theme.primaryColor
					}}
					disabled={verificationCode && password ? false : true}
				/>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	header: {
		marginTop: PxFit(50),
		marginBottom: PxFit(40),
		paddingHorizontal: PxFit(25)
	},
	textWrap: {
		marginTop: PxFit(5),
		marginHorizontal: PxFit(25),
		paddingHorizontal: 0,
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.lightBorder
	}
});

export default compose(
	graphql(GQL.ResetPasswordMutation, { name: 'ResetPasswordMutation' }),
	graphql(GQL.SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' })
)(RetrievePassword);
