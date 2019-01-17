import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';

import Screen from '../../Screen';

import { DivisionLine, Avatar, Header, Button } from '../../../components';
import { Iconfont } from '../../../utils/Fonts';

import { Colors, Methods } from '../../../constants';

import { connect } from 'react-redux';
import actions from '../../../store/actions';
import { SetUserPaymentInfoMutation } from '../../../graphql/withdraws.graphql';
import { Mutation } from 'react-apollo';

class EditProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			real_name: this.props.user.real_name,
			pay_account: '',
			password: ''
		};
	}

	render() {
		let { navigation, user } = this.props;
		const { real_name, pay_account, password } = this.state;
		return (
			<Screen header>
				<Header customStyle={{ borderBottomColor: 'transparent' }} />
				<DivisionLine height={10} />
				<View style={styles.container}>
					<View style={{ paddingHorizontal: 15, marginVertical: 15 }}>
						<Text style={{ fontWeight: '300', color: Colors.grey, lineHeight: 20 }}>
							支付宝账号为提现有效证据,请输入已经通过实名认证的支付宝账号,否则提现将失败.
						</Text>
					</View>
					<TextInput
						ref="textInput"
						style={{
							height: 44,
							paddingHorizontal: 15,
							padding: 0,
							paddingVertical: 13,
							borderTopWidth: 1,
							borderTopColor: Colors.lightBorder,
							borderBottomWidth: 1,
							borderBottomColor: Colors.lightBorder,
							fontSize: 16
						}}
						editable={user.real_name ? false : true}
						placeholder={user.real_name ? user.real_name : '请输入支付宝姓名'}
						underlineColorAndroid="transparent"
						selectionColor="#000"
						autoCapitalize={'none'}
						onChangeText={real_name => {
							this.setState({ real_name: real_name });
						}}
					/>
					<TextInput
						ref="textInput"
						style={{
							height: 44,
							paddingHorizontal: 15,
							padding: 0,
							paddingVertical: 13,
							borderBottomWidth: 1,
							borderBottomColor: Colors.lightBorder,
							fontSize: 16
						}}
						placeholder="请输入支付宝账号"
						defaultValue={this.state.pay_account}
						underlineColorAndroid="transparent"
						selectionColor="#000"
						autoCapitalize={'none'}
						onChangeText={pay_account => {
							this.setState({ pay_account: pay_account });
						}}
					/>
					<TextInput
						ref="textInput"
						style={{
							height: 44,
							paddingHorizontal: 15,
							padding: 0,
							paddingVertical: 13,
							borderBottomWidth: 1,
							borderBottomColor: Colors.lightBorder,
							fontSize: 16
						}}
						placeholder="请输入APP登录密码"
						underlineColorAndroid="transparent"
						selectionColor="#000"
						defaultValue={this.state.password}
						autoCapitalize={'none'}
						secureTextEntry={true}
						onChangeText={password => {
							this.setState({ password: password });
						}}
					/>
					<Mutation mutation={SetUserPaymentInfoMutation}>
						{SetUserPaymentInfoMutation => {
							return (
								<Button
									name={'提交'}
									style={{ height: 40, marginHorizontal: 15, marginTop: 20 }}
									disabled={!(real_name && pay_account && password)}
									theme={real_name && pay_account ? Colors.theme : 'rgba(64,127,207,0.7)'}
									handler={async () => {
										const phoneReg = /^1[3-9]\d{9}$/;
										const mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

										//手机号限制11位   第一位为1  第二位不为2  后9位随机
										if (phoneReg.test(pay_account) || mailReg.test(pay_account)) {
											let result = {};
											try {
												await SetUserPaymentInfoMutation({
													variables: {
														real_name,
														pay_account,
														password
													}
												});
											} catch (ex) {
												result.errors = ex;
											}
											if (result && result.errors) {
												let str = result.errors
													.toString()
													.replace(/Error: GraphQL error: /, '');
												Methods.toast(str, -100); //打印错误信息
											} else {
												Methods.toast('绑定成功', -200);
												this.props.dispatch(
													actions.updateAlipay({
														real_name: real_name,
														pay_account: pay_account
													})
												);
												navigation.goBack();
											}
											this.setState({
												pay_account: '',
												password: ''
											});
										} else {
											Methods.toast('支付宝账号格式错误', 80);
										}
										this.setState({
											pay_account: '',
											password: ''
										});
									}}
								/>
							);
						}}
					</Mutation>
					<View style={{ paddingHorizontal: 15 }}>
						<Text style={{ fontSize: 14, color: Colors.themeRed, paddingTop: 15 }}>
							注意:每个用户最多修改3次支付宝！
						</Text>
					</View>
				</View>
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

export default connect(store => ({ user: store.users.user }))(EditProfileScreen);
