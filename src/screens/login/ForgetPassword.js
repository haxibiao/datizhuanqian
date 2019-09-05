/*
 * @Author: Gaoxuan
 * @Date:   2019-03-28 09:17:40
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Button, PageContainer, SubmitLoading, CustomTextInput, KeyboardSpacer } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from 'utils';

import { Mutation, compose, graphql, GQL } from 'apollo';

class VerificationScreen extends Component {
	constructor(props) {
		super(props);
		console.log(' props.navigation.state.params', props.navigation.state.params);
		this.state = {
			account: props.navigation.state.params.account,
			isOnpress: true,
			second: 5000,
			buttonColor: Theme.primaryColor,
			submitting: false
		};
	}

	sendVerificationCode = async () => {
		const { navigation } = this.props;
		let { account, second } = this.state;
		let result = {};

		if (Tools.regular(account)) {
			this.setState({
				isOnpress: false,
				submitting: true
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
				Toast.show({ content: str });
				this.setState({ submitting: false });
			} else {
				navigation.navigate('RetrievePassword', {
					account: account,
					time: result.data.sendVerificationCode.surplusSecond
				});
				this.setState({ submitting: false });
			}
			setTimeout(() => {
				this.setState({ isOnpress: true });
			}, second);
		} else {
			Toast.show({ content: '账号格式错误' });
		}
	};

	render() {
		const { navigation } = this.props;
		let { account, isOnpress, second, buttonColor, submitting } = this.state;

		let { title } = navigation.state.params;

		return (
			<PageContainer title={title} white submitting={submitting} submitTips="发送中...">
				<View style={styles.container}>
					<View style={{ marginTop: 50, paddingHorizontal: 25 }}>
						<Text style={{ color: Theme.black, fontSize: 20, fontWeight: '600' }}>获取验证码</Text>
					</View>
					<View style={styles.textWrap}>
						<CustomTextInput
							textAlignVertical={'center'}
							placeholder={'请输入手机号或邮箱'}
							selectionColor={Theme.primaryColor}
							maxLength={48}
							style={styles.textInput}
							onChangeText={value => {
								this.setState({
									account: value
								});
							}}
							value={account}
							autoFocus
						/>
					</View>

					<Button
						title="获取验证码"
						onPress={this.sendVerificationCode}
						disabled={account ? false : true}
						style={{
							marginHorizontal: 25,
							marginTop: 35,
							height: PxFit(40),
							backgroundColor: Theme.primaryColor
						}}
					/>
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
	textWrap: {
		marginTop: PxFit(40),
		marginHorizontal: PxFit(25),
		paddingHorizontal: 0,
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.lightBorder
	},
	textInput: {
		fontSize: PxFit(16),
		color: Theme.primaryFont,
		padding: 0,
		height: PxFit(50)
	}
});

export default compose(graphql(GQL.SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' }))(
	VerificationScreen
);
