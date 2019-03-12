import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Button, Screen, Input, KeyboardSpacer } from '../../components';
import { Colors } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { ResetPasswordMutation, SendVerificationCodeMutation } from '../../graphql/user.graphql';
import { compose, graphql } from 'react-apollo';

let countDown = 59;

class RetrievePasswordScreen extends Component {
	constructor(props) {
		super(props);
		let { time } = this.props.navigation.state.params;
		this.time_remaining = time ? time : 60;
		this.state = {
			verificationCode: '',
			password: '',
			tips: `${this.time_remaining}s后重新发送`,
			disabled: true
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
			let str = result.errors[0].message;
			Methods.toast(str, 100);
		} else {
			this.countDown();
		}
	};

	//重置密码
	async resetPassword() {
		const { navigation } = this.props;
		let { verificationCode, password, disabled } = this.state;
		const { account } = navigation.state.params;
		let result = {};
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
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, 80); //打印错误信息
		} else {
			Methods.toast('新密码设置成功');
			navigation.pop(2);
		}
	}

	render() {
		const { navigation } = this.props;
		let { verificationCode, password, disabled, tips } = this.state;

		return (
			<Screen>
				<View style={{ marginTop: 50, marginBottom: 30, paddingHorizontal: 25 }}>
					<Text style={{ color: Colors.black, fontSize: 20, fontWeight: '600' }}>设置新密码</Text>
				</View>
				<Input
					placeholder={'请输入验证码'}
					autoFocus
					viewStyle={{ marginHorizontal: 25, paddingHorizontal: 0 }}
					keyboardType={'numeric'}
					changeValue={value => {
						this.setState({
							verificationCode: value
						});
					}}
				/>
				<Input
					placeholder={'请输入新密码'}
					viewStyle={{ marginHorizontal: 25, paddingHorizontal: 0 }}
					password
					changeValue={value => {
						this.setState({
							password: value
						});
					}}
				/>
				<TouchableOpacity
					style={{ marginHorizontal: 25, marginTop: 15 }}
					onPress={this.resendVerificationCode}
					disabled={!(this.time_remaining == 60)}
				>
					<Text style={{ color: this.time_remaining == 60 ? Colors.theme : Colors.grey }}>{tips}</Text>
				</TouchableOpacity>
				<View style={{ marginHorizontal: 25, marginTop: 30, height: 48 }}>
					<Button
						name="完成"
						handler={this.resetPassword.bind(this)}
						style={{ height: 38, fontSize: 16 }}
						disabled={verificationCode && password ? false : true}
					/>
				</View>
				<KeyboardSpacer />
			</Screen>
		);
	}
}

const styles = StyleSheet.create({});

export default connect(store => ({
	user: store.users.user
}))(
	compose(
		graphql(ResetPasswordMutation, { name: 'ResetPasswordMutation' }),
		graphql(SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' })
	)(RetrievePasswordScreen)
);
