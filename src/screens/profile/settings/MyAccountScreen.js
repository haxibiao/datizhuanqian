import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { DivisionLine, Button, Input, Screen } from '../../../components';

import { Colors } from '../../../constants';
import { Methods } from '../../../helpers';

import { connect } from 'react-redux';
import actions from '../../../store/actions';
import { SetUserPaymentInfoMutation } from '../../../graphql/withdraws.graphql';
import { compose, graphql } from 'react-apollo';

import KeyboardSpacer from 'react-native-keyboard-spacer';

class EditProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			real_name: this.props.user.real_name,
			pay_account: ''
		};
	}

	//设置提现账号
	async setPaymentInfo() {
		const phoneReg = /^1[3-9]\d{9}$/;
		const mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		//手机号限制11位   第一位为1  第二位不为2  后9位随机   邮箱为标准地址
		let { pay_account, real_name } = this.state;
		const { navigation } = this.props;
		let result = {};

		if (phoneReg.test(pay_account) || mailReg.test(pay_account)) {
			try {
				result = await this.props.SetUserPaymentInfoMutation({
					variables: {
						real_name,
						pay_account
					},
					errorPolicy: 'all'
				});
			} catch (ex) {
				result.errors = ex;
			}
			if (result && result.errors) {
				let str = result.errors[0].message;
				Methods.toast(str, 100);
				navigation.navigate('验证', { time: 50 });
			} else {
				this.props.dispatch(
					actions.updateAlipay({
						real_name: real_name,
						pay_account: pay_account
					})
				);
				navigation.navigate('验证', { time: 0 });
			}
			this.setState({
				pay_account: ''
			});
		} else {
			Methods.toast('支付宝格式错误', 100);
		}
		this.setState({
			pay_account: ''
		});
	}

	render() {
		let { navigation, user } = this.props;
		const { real_name, pay_account } = this.state;
		return (
			<Screen>
				<View style={styles.container}>
					<View style={{ marginTop: 25, paddingHorizontal: 25 }}>
						<Text style={{ color: Colors.black, fontSize: 20, fontWeight: '600' }}>支付宝信息</Text>
					</View>
					<View style={styles.header}>
						<Text style={styles.tips}>
							支付宝账号为提现有效证据,请输入已经通过实名认证的支付宝账号,否则提现将失败.
						</Text>
					</View>

					<Input
						viewStyle={{ marginHorizontal: 25, paddingHorizontal: 0 }}
						placeholder={user.real_name ? user.real_name : '请输入支付宝姓名'}
						editable={user.real_name ? false : true}
						changeValue={value => {
							this.setState({
								real_name: value
							});
						}}
					/>

					<Input
						placeholder="请输入支付宝账号"
						viewStyle={{ marginHorizontal: 25, paddingHorizontal: 0 }}
						defaultValue={this.state.pay_account}
						changeValue={value => {
							this.setState({
								pay_account: value
							});
						}}
						maxLength={50}
					/>

					<Button
						name={'提交'}
						style={styles.button}
						disabled={!(real_name && pay_account)}
						theme={real_name && pay_account ? Colors.theme : 'rgba(64,127,207,0.7)'}
						handler={this.setPaymentInfo.bind(this)}
					/>

					<View style={{ paddingHorizontal: 25 }}>
						<Text style={styles.footer}>
							注意:每个账号只能绑定一个支付宝账号，一人多个账号无法享受提现功能,并且最多修改3次支付宝账号！
						</Text>
					</View>
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
	},
	header: {
		paddingHorizontal: 25,
		marginVertical: 15
	},
	tips: {
		fontWeight: '300',
		color: Colors.grey,
		lineHeight: 20
	},
	button: {
		height: 38,
		marginHorizontal: 25,
		marginTop: 35
	},
	footer: {
		fontSize: 13,
		color: Colors.themeRed,
		paddingTop: 15
	}
});

export default connect(store => ({ user: store.users.user }))(
	compose(graphql(SetUserPaymentInfoMutation, { name: 'SetUserPaymentInfoMutation' }))(EditProfileScreen)
);
