/*
 * @flow
 * created by wyk made in 2019-03-22 12:01:39
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PageContainer, TouchFeedback, Button, CustomTextInput, KeyboardSpacer, SubmitLoading } from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { UpdateUserPasswordMutation } from '../../assets/graphql/user.graphql';
import { compose, graphql } from 'react-apollo';

class ModifyPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldPassword: '',
			password: '',
			disabled: true,
			againpassword: '',
			isVisible: false
		};
	}

	//修改账号密码
	async updatePassword() {
		let { password, oldPassword, againpassword } = this.state;
		const { navigation } = this.props;

		if (password.indexOf(' ') >= 0) {
			Toast.show({ content: '请勿输入空格' });
		} else {
			let result = {};
			if (password == againpassword) {
				this.setState({
					isVisible: true
				});
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
					this.setState({
						isVisible: false
					});
					let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
					Toast.show({ content: str }); //打印错误信息
				} else {
					this.setState({
						isVisible: true
					});
					Toast.show({ content: '新密码设置成功' });
					navigation.goBack();
				}
			} else {
				Toast.show({ content: '两次输入的密码不一致' });
			}
		}
	}

	render() {
		let { oldPassword, password, disabled, againpassword, isVisible } = this.state;
		return (
			<PageContainer white title="修改密码">
				<View style={{ marginVertical: PxFit(35), paddingHorizontal: PxFit(25) }}>
					<Text style={{ color: Theme.black, fontSize: PxFit(20), fontWeight: '600' }}>提交新密码</Text>
				</View>
				<View style={styles.inputWrap}>
					<CustomTextInput
						placeholder={'请输入原始密码'}
						style={{ height: PxFit(48) }}
						onChangeText={value => {
							this.setState({
								oldPassword: value
							});
						}}
						secureTextEntry={true}
						maxLength={32}
					/>
				</View>
				<View style={styles.inputWrap}>
					<CustomTextInput
						placeholder={'请输入新密码,不少于6位'}
						style={{ height: PxFit(48) }}
						onChangeText={value => {
							this.setState({
								password: value
							});
						}}
						secureTextEntry={true}
						maxLength={16}
					/>
				</View>
				<View style={styles.inputWrap}>
					<CustomTextInput
						placeholder={'请再次输入新密码,不少于6位'}
						style={{ height: PxFit(48) }}
						onChangeText={value => {
							this.setState({
								againpassword: value
							});
						}}
						secureTextEntry={true}
						maxLength={16}
					/>
				</View>

				<Button
					title="完成"
					onPress={this.updatePassword.bind(this)}
					style={styles.button}
					disabled={oldPassword && password.length > 5 && againpassword.length > 5 ? false : true}
				/>
				<SubmitLoading isVisible={isVisible} content={'提交中...'} />
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
	inputWrap: {
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.lightBorder,
		marginHorizontal: PxFit(25),
		paddingHorizontal: 0
	},
	button: {
		height: 38,
		fontSize: 16,
		marginHorizontal: 25,
		marginVertical: 30,
		backgroundColor: Theme.theme
	}
});

export default compose(graphql(UpdateUserPasswordMutation, { name: 'UpdateUserPasswordMutation' }))(ModifyPassword);
