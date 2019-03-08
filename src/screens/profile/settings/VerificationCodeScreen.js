/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 10:02:02
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button, Screen, SubmitLoading, Input } from '../../../components';
import { Colors } from '../../../constants';
import { Methods } from '../../../helpers';

import { connect } from 'react-redux';
import actions from '../../../store/actions';

import { SetUserPaymentInfoMutation } from '../../../graphql/withdraws.graphql';
import { Mutation, compose, graphql } from 'react-apollo';

import KeyboardSpacer from 'react-native-keyboard-spacer';

let countDown = 59;

class VerificationCodeScreen extends Component {
	constructor(props) {
		super(props);
		let { time } = this.props.navigation.state.params;
		this.state = {
			tips: `${time ? time : '60'}s后重新发送`,
			verificationCode: null,
			isVisible: false
		};
	}
	componentDidMount() {
		this.countDown();
	}

	componentWillUpdate(nextProps, nextState) {
		if (countDown == 0) {
			countDown = 60;
			this.setState({
				tips: '重新获取验证码'
			});
			this.timer && clearInterval(this.timer);
		}
	}

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	countDown = () => {
		let { time } = this.props.navigation.state.params;
		countDown = time ? time : 60;
		this.timer = setInterval(() => {
			countDown--;
			this.setState({
				tips: `${countDown}s后重新发送`
			});
		}, 1000);
	};

	//设置提现账号
	setPaymentInfo = async () => {
		let { verificationCode } = this.state;
		const { navigation } = this.props;
		const { code, accountInfo } = navigation.state.params;
		let result = {};

		if (code == verificationCode) {
			this.setState({
				isVisible: true
			});
			try {
				result = await this.props.SetUserPaymentInfoMutation({
					variables: {
						real_name: accountInfo.real_name,
						pay_account: accountInfo.pay_account,
						code: code
					},
					errorPolicy: 'all'
				});
			} catch (ex) {
				result.errors = ex;
			}
			console.log('result', result);
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
				this.props.dispatch(
					actions.updateAlipay({
						real_name: accountInfo.real_name,
						pay_account: accountInfo.pay_account
					})
				);
				navigation.pop(2);
				Methods.toast('修改成功', 100);
			}
			this.setState({
				pay_account: ''
			});
		} else {
			Methods.toast('验证码错误', 100);
		}
		this.setState({
			verificationCode: ''
		});
	};

	render() {
		const { navigation } = this.props;
		let { verificationCode, tips, isVisible } = this.state;

		return (
			<Screen>
				<View style={styles.container}>
					<View style={{ marginTop: 50, paddingHorizontal: 25 }}>
						<Text style={{ color: Colors.black, fontSize: 20, fontWeight: '600' }}>输入验证码</Text>
						<Text style={{ color: Colors.grey, fontSize: 12, paddingTop: 20 }}>
							验证码已发送至 {this.props.users.user.account}
						</Text>
					</View>
					<Input
						placeholder="请输入收到的哈希表科技验证码"
						viewStyle={{ marginHorizontal: 25, paddingHorizontal: 0, marginTop: 30 }}
						defaultValue={this.state.verificationCode}
						autoFocus
						keyboardType={'numeric'}
						changeValue={value => {
							this.setState({
								verificationCode: value
							});
						}}
					/>
					<View style={{ marginHorizontal: 25, marginTop: 35, height: 48 }}>
						<Button
							name="确认"
							handler={this.setPaymentInfo}
							theme={Colors.theme}
							style={{ height: 38, fontSize: 16 }}
							disabled={verificationCode ? false : true}
							disabledColor={Colors.tintGray}
						/>
					</View>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginHorizontal: 25,
							marginTop: 15
						}}
					>
						<TouchableOpacity onPress={this.resendVerificationCode} disabled={!(countDown == 60)}>
							<Text style={{ color: countDown == 60 ? Colors.theme : Colors.grey, fontSize: 13 }}>
								{this.state.tips}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity>
							<Text style={{ color: Colors.grey, fontSize: 13 }}>账号有误?</Text>
						</TouchableOpacity>
					</View>
				</View>
				<SubmitLoading isVisible={isVisible} tips={'验证中...'} />
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
	textWrap: {
		marginTop: 40,
		marginHorizontal: 25,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder
	},
	textInput: {
		fontSize: 16,
		color: Colors.primaryFont,
		padding: 0,
		height: 50
	}
});

export default connect(store => store)(
	compose(graphql(SetUserPaymentInfoMutation, { name: 'SetUserPaymentInfoMutation' }))(VerificationCodeScreen)
);
