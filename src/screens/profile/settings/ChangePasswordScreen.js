import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { Button, Input, Screen, DivisionLine, KeyboardSpacer } from '../../../components';
import { Colors } from '../../../constants';
import { Methods } from '../../../helpers';

import { connect } from 'react-redux';
import actions from '../../../store/actions';

import { UpdateUserPasswordMutation } from '../../../graphql/user.graphql';
import { compose, graphql } from 'react-apollo';

class ChangePasswordScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldPassword: '',
			password: '',
			disabled: true,
			againpassword: ''
		};
	}

	//修改账号密码
	async updatePassword() {
		let { password, oldPassword, againpassword } = this.state;
		const { navigation } = this.props;

		if (password.indexOf(' ') >= 0) {
			Methods.toast('密码格式错误', 70);
		} else {
			let result = {};
			if (password == againpassword) {
				try {
					result = await this.props.UpdateUserPasswordMutation({
						variables: {
							old_password: oldPassword,
							new_password: password
						}
					});
				} catch (ex) {
					result.errors = ex;
				}
				if (result && result.errors) {
					let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
					Methods.toast(str, -100); //打印错误信息
				} else {
					Methods.toast('新密码设置成功', -180);
					navigation.goBack();
				}
			} else {
				Methods.toast('两次输入的密码不一致', 80);
			}
		}
	}

	render() {
		let { oldPassword, password, disabled, againpassword } = this.state;
		return (
			<Screen>
				<DivisionLine height={10} />
				<Input
					placeholder={'请输入原始密码'}
					password
					changeValue={value => {
						this.setState({
							oldPassword: value
						});
					}}
					maxLength={32}
				/>
				<Input
					placeholder={'请输入新密码,不少于6位'}
					password
					changeValue={value => {
						this.setState({
							password: value
						});
					}}
					maxLength={16}
				/>
				<Input
					placeholder={'请再次输入新密码,不少于6位'}
					password
					changeValue={value => {
						this.setState({
							againpassword: value
						});
					}}
					maxLength={16}
				/>
				<View style={{ margin: 20, height: 48 }}>
					<Button
						name="完成"
						handler={this.updatePassword.bind(this)}
						style={{ height: 38, fontSize: 16 }}
						disabled={oldPassword && password.length > 5 && againpassword.length > 5 ? false : true}
						disabledColor={'rgba(255,177,0,0.7)'}
					/>
				</View>
				<KeyboardSpacer />
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	}
});

export default compose(graphql(UpdateUserPasswordMutation, { name: 'UpdateUserPasswordMutation' }))(
	ChangePasswordScreen
);
