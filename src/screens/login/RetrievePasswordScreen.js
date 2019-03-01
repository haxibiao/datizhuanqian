import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Button, Screen, Input } from '../../components';

import { Colors } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { ResetPasswordMutation, ForgotPasswordMutation } from '../../graphql/user.graphql';
import { compose, graphql } from 'react-apollo';
import KeyboardSpacer from 'react-native-keyboard-spacer';

let countDown = 59;

class RetrievePasswordScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			verification: '',
			password: '',
			tips: '60s后重新发送',
			disabled: true
		};
	}

	componentDidMount() {
		this.countDown();
	}

	componentWillUpdate(nextProps, nextState) {
		if (countDown == 0) {
			countDown = 60;
			this.setState({
				tips: '重新发送'
			});
			this.timer && clearInterval(this.timer);
		}
	}

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	countDown = () => {
		countDown = 60;
		this.timer = setInterval(() => {
			countDown--;
			this.setState({
				tips: `${countDown}s后重新发送`
			});
		}, 1000);
	};
	//重置密码
	async resetPassword() {
		const { navigation } = this.props;
		let { verification, password, disabled } = this.state;
		const { account } = navigation.state.params;

		let result = {};
		try {
			result = await this.props.ResetPasswordMutation({
				variables: {
					account: account,
					password: password,
					authentication_code: verification
				}
			});
		} catch (ex) {
			result.errors = ex;
		}
		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, -100); //打印错误信息
		} else {
			Methods.toast('新密码设置成功');
			navigation.pop(2);
		}
	}

	resendVerificationCode = async () => {
		const { navigation } = this.props;
		const { account } = navigation.state.params;
		let result = {};

		this.countDown();

		try {
			result = await this.props.ForgotPasswordMutation({
				variables: {
					account: account
				}
			});
		} catch (error) {
			result.errors = error;
		}
		console.log('result', result);
		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, -100); //打印错误信息
		}
	};

	render() {
		const { navigation } = this.props;
		let { verification, password, disabled, tips } = this.state;

		return (
			<Screen>
				<View style={{ marginTop: 50, marginBottom: 30, paddingHorizontal: 25 }}>
					<Text style={{ color: Colors.black, fontSize: 20, fontWeight: '600' }}>设置新密码</Text>
				</View>
				<Input
					placeholder={'请输入验证码'}
					viewStyle={{ marginHorizontal: 25, paddingHorizontal: 0 }}
					changeValue={value => {
						this.setState({
							verification: value
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
					disabled={!(countDown == 60)}
				>
					<Text style={{ color: countDown == 60 ? Colors.theme : Colors.grey }}>{this.state.tips}</Text>
				</TouchableOpacity>
				<View style={{ marginHorizontal: 25, marginTop: 30, height: 48 }}>
					<Button
						name="完成"
						handler={this.resetPassword.bind(this)}
						style={{ height: 38, fontSize: 16 }}
						disabled={verification && password ? false : true}
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
		graphql(ForgotPasswordMutation, { name: 'ForgotPasswordMutation' })
	)(RetrievePasswordScreen)
);
