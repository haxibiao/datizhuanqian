import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Button, Screen, LoginWaiting } from '../../components';
import { Colors } from '../../constants';
import { Methods } from '../../helpers';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { ForgotPasswordMutation } from '../../graphql/user.graphql';
import { Mutation, compose, graphql } from 'react-apollo';

class VerificationEmailScreen extends Component {
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

		this.setState({
			isOnpress: false,
			isVisible: true
		});

		try {
			result = await this.props.ForgotPasswordMutation({
				variables: {
					account: account
				}
			});
		} catch (error) {
			result.errors = error;
		}
		if (result && result.errors) {
			let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
			Methods.toast(str, -100); //打印错误信息
			this.setState({ isVisible: false });
		} else {
			navigation.navigate('重置密码', {
				account: account
			});
			this.setState({ isVisible: false });
		}
		setTimeout(() => {
			this.setState({ isOnpress: true });
		}, second);
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
						<TextInput
							textAlignVertical="center"
							underlineColorAndroid="transparent"
							placeholder="请输入手机号或邮箱"
							placeholderText={Colors.tintFont}
							selectionColor={Colors.theme}
							style={styles.textInput}
							onChangeText={account => {
								this.setState({ account });
							}}
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
				<LoginWaiting isVisible={isVisible} tips={'发送中...'} />
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
	compose(graphql(ForgotPasswordMutation, { name: 'ForgotPasswordMutation' }))(VerificationEmailScreen)
);
