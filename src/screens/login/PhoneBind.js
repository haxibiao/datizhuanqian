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
} from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Tools } from 'utils';

import { compose, graphql, withApollo, GQL } from 'apollo';

class PhoneBind extends Component {
	constructor(props) {
		super(props);
		this.state = {
			phone: null,
			submitting: false
		};
	}

	checkAccount = async () => {
		const { navigation, client } = this.props;

		if (this.state.phone) {
			client
				.query({
					query: GQL.accountHasExisted,
					variables: {
						account: this.state.phone
					},
					fetchPolicy: 'network-only'
				})
				.then(result => {
					if (result.data && result.data.accountHasExisted) {
						Toast.show({
							content: '账号已存在,请登录后绑定'
						});
					} else {
						this.sendCode();
					}
				})
				.catch(error => {});
		} else {
			Toast.show({ content: '请输入手机号' });
		}
	};

	sendCode = async () => {
		const { navigation } = this.props;
		let data = navigation.getParam('data');

		let result = {};
		this.setState({
			submitting: true
		});
		try {
			result = await this.props.SendVerificationCodeMutation({
				variables: {
					account: this.state.phone,
					action: 'USER_LOGIN'
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
			console.log('result.errors', result.errors);
			let str = result.errors[0].message;
			Toast.show({ content: str });
		} else {
			this.setState({
				submitting: false
			});
			navigation.navigate('VerificationPhone', {
				code: result.data.sendVerificationCode.code,
				time: result.data.sendVerificationCode.surplusSecond,
				phone: this.state.phone,
				data: data
			});
		}
	};

	render() {
		let { navigation } = this.props;
		const { phone, submitting } = this.state;

		return (
			<PageContainer title="手机号绑定" white submitting={submitting}>
				<View style={styles.container}>
					<View style={{ marginTop: PxFit(50), paddingHorizontal: PxFit(25), paddingBottom: PxFit(15) }}>
						<Text style={styles.tipsText}>绑定手机号，让你的账号更安全</Text>
					</View>
					<View style={styles.inputWrap}>
						<CustomTextInput
							placeholder={'请输入手机号'}
							style={{ height: PxFit(48) }}
							onChangeText={value => {
								this.setState({
									phone: value
								});
							}}
						/>
					</View>
					<Button title={'下一步'} style={styles.button} onPress={this.checkAccount} />
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
	tipsText: {
		color: Theme.grey,
		fontSize: PxFit(13)
	},
	inputWrap: {
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.borderColor,
		marginHorizontal: PxFit(25),
		paddingHorizontal: 0
	},
	button: {
		height: PxFit(42),
		borderRadius: PxFit(21),
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

export default compose(graphql(GQL.SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' }))(
	withApollo(PhoneBind)
);
