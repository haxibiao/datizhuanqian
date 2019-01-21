import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Button, Screen, Input } from '../../components';
import { Colors, Methods } from '../../constants';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { ResetPasswordMutation } from '../../graphql/user.graphql';
import { compose, graphql } from 'react-apollo';

class RetrievePasswordScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			verification: '',
			password: '',
			disabled: true,
			againpassword: ''
		};
	}

	//重置密码
	async resetPassword() {
		const { navigation } = this.props;
		let { verification, password, disabled, againpassword } = this.state;
		const { result, account } = navigation.state.params;

		if (result[0] == verification) {
			if (password == againpassword) {
				let errors = {};
				try {
					errors = await this.props.ResetPasswordMutation({
						variables: {
							account: account,
							password: password,
							token: result[1]
						}
					});
				} catch (ex) {
					errors.error = ex;
				}
				if (errors && errors.error) {
					let str = errors.error.toString().replace(/Error: GraphQL error: /, '');
					Methods.toast(str, -100); //打印错误信息
				} else {
					Methods.toast('新密码设置成功');
					navigation.pop(2);
				}
			} else {
				Methods.toast('两次输入的密码不一致');
			}
		} else {
			Methods.toast('验证码错误,请输入正确的验证码');
		}
	}

	render() {
		const { navigation } = this.props;
		let { verification, password, disabled, againpassword } = this.state;

		return (
			<Screen>
				<Input
					placeholder={'请输入验证码'}
					changeValue={value => {
						this.setState({
							verification: value
						});
					}}
				/>
				<Input
					placeholder={'请输入新密码'}
					password
					changeValue={value => {
						this.setState({
							password: value
						});
					}}
				/>
				<Input
					placeholder={'请再次输入新密码'}
					password
					changeValue={value => {
						this.setState({
							againpassword: value
						});
					}}
				/>

				<View style={{ margin: 20, height: 48 }}>
					<Button
						name="完成"
						handler={this.resetPassword.bind(this)}
						style={{ height: 38, fontSize: 16 }}
						disabled={verification && password && againpassword ? false : true}
					/>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({});

export default connect(store => ({
	user: store.users.user
}))(compose(graphql(ResetPasswordMutation, { name: 'ResetPasswordMutation' }))(RetrievePasswordScreen));
