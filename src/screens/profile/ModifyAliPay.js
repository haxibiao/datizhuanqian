/*
 * @flow
 * created by wyk made in 2019-03-22 12:02:09
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
	PageContainer,
	TouchFeedback,
	Iconfont,
	Row,
	ListItem,
	Button,
	CustomTextInput,
	KeyboardSpacer,
	SubmitLoading
} from '../../components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from '../../utils';

import { connect } from 'react-redux';
import actions from '../../store/actions';
import { SendVerificationCodeMutation } from '../../assets/graphql/user.graphql';
import { compose, graphql } from 'react-apollo';

class EditProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			real_name: this.props.user.real_name,
			pay_account: '',
			submitting: false
		};
	}

	sendVerificationCode = async () => {
		const { navigation } = this.props;
		let result = {};
		var reg = /^[\u4E00-\u9FA5]{1,8}$/;

		if (Tools.regular(this.state.pay_account)) {
			if (reg.test(this.state.real_name)) {
				this.setState({
					submitting: true
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
						submitting: false
					});
					let str = result.errors[0].message;
					Toast.show({ content: str });
				} else {
					this.setState({
						submitting: false
					});
					navigation.navigate('VerificationCode', {
						code: result.data.sendVerificationCode.code,
						time: result.data.sendVerificationCode.surplusSecond,
						accountInfo: {
							real_name: this.state.real_name,
							pay_account: this.state.pay_account
						}
					});
				}
			} else {
				Toast.show({ content: '姓名格式错误' });
			}
		} else {
			Toast.show({ content: '支付宝格式错误' });
		}
	};

	render() {
		let { navigation, user } = this.props;
		const { real_name, pay_account, submitting } = this.state;
		return (
			<PageContainer title="账户绑定" white submitting={submitting}>
				<View style={styles.container}>
					<View style={{ marginTop: PxFit(25), paddingHorizontal: PxFit(25) }}>
						<Text style={{ color: Theme.black, fontSize: 20, fontWeight: '600' }}>支付宝信息绑定</Text>
					</View>
					<View style={styles.header}>
						<Text style={styles.tips}>
							<Text style={{ color: Theme.secondaryColor }}>支付宝账号</Text>
							以及
							<Text style={{ color: Theme.secondaryColor }}>真实姓名</Text>
							为提现有效证据,请输入已经通过实名认证的支付宝账号,否则提现将失败.
						</Text>
					</View>

					<View style={styles.inputWrap}>
						<CustomTextInput
							style={{ height: PxFit(48) }}
							placeholder={real_name || '请输入真实姓名'}
							onChangeText={value => {
								this.setState({
									real_name: value
								});
							}}
							value={real_name}
							maxLength={8}
						/>
					</View>
					<View style={styles.inputWrap}>
						<CustomTextInput
							placeholder="请输入支付宝账号"
							style={{ height: PxFit(48) }}
							onChangeText={value => {
								this.setState({
									pay_account: value
								});
							}}
							value={pay_account}
							maxLength={48}
						/>
					</View>

					<Button
						title={'提交'}
						style={styles.button}
						disabled={!(real_name && pay_account)}
						onPress={this.sendVerificationCode}
					/>

					<View style={{ paddingHorizontal: PxFit(25), marginTop: PxFit(5) }}>
						<Text style={styles.footer}>
							* 每个支付宝只能被一个答题赚钱账号绑定，多账号绑定将无法享受提现功能。
						</Text>
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
		paddingHorizontal: PxFit(25),
		marginVertical: PxFit(15)
	},
	tips: {
		fontWeight: '300',
		color: Theme.grey,
		lineHeight: PxFit(20)
	},
	inputWrap: {
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.borderColor,
		marginHorizontal: PxFit(25),
		paddingHorizontal: 0
	},
	button: {
		height: PxFit(38),
		marginHorizontal: PxFit(25),
		marginTop: PxFit(35),
		backgroundColor: Theme.primaryColor
	},
	footer: {
		fontSize: PxFit(12),
		lineHeight: PxFit(16),
		color: Theme.secondaryColor,
		paddingTop: PxFit(15)
	}
});

export default connect(store => ({ user: store.users.user }))(
	compose(graphql(SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' }))(EditProfileScreen)
);
