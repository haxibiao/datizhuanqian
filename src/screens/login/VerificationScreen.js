import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Button, Screen, SubmitLoading, Input, KeyboardSpacer } from '../../components';
import { Colors } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { SendVerificationCodeMutation } from '../../graphql/user.graphql';
import { Mutation, compose, graphql } from 'react-apollo';

class VerificationScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			account: '',
			isOnpress: true,
			second: 5000,
			buttonColor: Colors.theme,
			isVisible: false
		};
	}

	sendVerificationCode = async () => {
		const { navigation } = this.props;
		let { account, second } = this.state;
		let result = {};

		if (Methods.regular(account)) {
			this.setState({
				isOnpress: false,
				isVisible: true
			});

			try {
				result = await this.props.SendVerificationCodeMutation({
					variables: {
						account: account,
						action: 'RESET_PASSWORD'
					},
					errorPolicy: 'all'
				});
			} catch (error) {
				result.errors = error;
			}
			if (result && result.errors) {
				let str = result.errors[0].message;
				Methods.toast(str, 100);
				this.setState({ isVisible: false });
			} else {
				navigation.navigate('重置密码', {
					account: account,
					time: result.data.sendVerificationCode.surplusSecond
				});
				this.setState({ isVisible: false });
			}
			setTimeout(() => {
				this.setState({ isOnpress: true });
			}, second);
		} else {
			Methods.toast('账号格式错误', 100);
		}
	};

	render() {
		const { navigation } = this.props;
		let { account, isOnpress, second, buttonColor, isVisible } = this.state;

		return (
			<Screen>
				<View style={styles.container}>
					<View style={{ marginTop: 50, paddingHorizontal: 25 }}>
						<Text style={{ color: Colors.black, fontSize: 20, fontWeight: '600' }}>获取验证码</Text>
					</View>
					<View style={styles.textWrap}>
						<Input
							textAlignVertical={'center'}
							viewStyle={{ paddingHorizontal: 0 }}
							placeholder={'请输入手机号或邮箱'}
							selectionColor={Colors.theme}
							customStyle={styles.textInput}
							changeValue={value => {
								this.setState({
									account: value
								});
							}}
							autoFocus
						/>
					</View>
					<View style={{ marginHorizontal: 25, marginTop: 35, height: 48 }}>
						<Button
							name="获取验证码"
							handler={this.sendVerificationCode}
							theme={buttonColor}
							style={{ height: 38, fontSize: 16 }}
							disabled={account && isOnpress ? false : true}
							disabledColor={Colors.tintGray}
						/>
					</View>
				</View>
				<SubmitLoading isVisible={isVisible} tips={'发送中...'} />
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
		marginHorizontal: 25
	},
	textInput: {
		fontSize: 16,
		color: Colors.primaryFont,
		padding: 0,
		height: 50
	}
});

export default connect(store => store)(
	compose(graphql(SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' }))(VerificationScreen)
);
