import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DivisionLine, Button, Input, Screen, SubmitLoading, KeyboardSpacer } from '../../../components';

import { Colors } from '../../../constants';
import { Methods } from '../../../helpers';

import { connect } from 'react-redux';
import actions from '../../../store/actions';
import { SendVerificationCodeMutation } from '../../../graphql/user.graphql';

import { compose, graphql } from 'react-apollo';

class EditProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			real_name: this.props.user.real_name,
			pay_account: '',
			isVisible: false
		};
	}

	sendVerificationCode = async () => {
		const { navigation } = this.props;
		let result = {};

		var reg = /^[\u4E00-\u9FA5]{1,8}$/;

		if (Methods.regular(this.state.pay_account)) {
			if (reg.test(this.state.real_name)) {
				this.setState({
					isVisible: true
				});
				try {
					result = await this.props.SendVerificationCodeMutation({
						variables: {
							account: this.props.user.account,
							action: 'USER_INFO_CHANGE'
						},
						errorPolicy: 'all'
					});
				} catch (ex) {
					result.errors = ex;
				}
				if (result && result.errors) {
					this.setState({
						isVisible: false
					});
					let str = result.errors[0].message;
					Methods.toast(str, 100);
				} else {
					this.setState({
						isVisible: false
					});
					navigation.navigate('验证', {
						code: result.data.sendVerificationCode.code,
						time: result.data.sendVerificationCode.surplusSecond,
						accountInfo: {
							real_name: this.state.real_name,
							pay_account: this.state.pay_account
						}
					});
				}
			} else {
				Methods.toast('姓名格式错误', 100);
			}
		} else {
			Methods.toast('支付宝格式错误', 100);
		}
	};

	render() {
		let { navigation, user } = this.props;
		const { real_name, pay_account, isVisible } = this.state;
		return (
			<Screen>
				<View style={styles.container}>
					<View style={{ marginTop: 25, paddingHorizontal: 25 }}>
						<Text style={{ color: Colors.black, fontSize: 20, fontWeight: '600' }}>支付宝信息绑定</Text>
					</View>
					<View style={styles.header}>
						<Text style={styles.tips}>
							<Text style={{ color: Colors.themeRed }}>支付宝账号</Text>
							以及
							<Text style={{ color: Colors.themeRed }}>真实姓名</Text>
							为提现有效证据,请输入已经通过实名认证的支付宝账号,否则提现将失败.
						</Text>
					</View>

					<Input
						viewStyle={{ marginHorizontal: 25, paddingHorizontal: 0 }}
						placeholder={user.real_name ? user.real_name : '请输入真实姓名'}
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
						handler={this.sendVerificationCode}
					/>

					<View style={{ paddingHorizontal: 25 }}>
						<Text style={styles.footer}>
							注意:每个账号只能绑定一个支付宝账号，一人多个账号无法享受提现功能,并且最多修改3次支付宝账号！
						</Text>
					</View>
				</View>
				<SubmitLoading isVisible={isVisible} tips={'提交中...'} />
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
	compose(graphql(SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' }))(EditProfileScreen)
);
