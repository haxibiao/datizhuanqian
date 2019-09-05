/*
 * @Author: Gaoxuan
 * @Date:   2019-04-18 17:27:51
 */

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

import { compose, graphql, GQL } from 'apollo';

class ModifyAccount extends Component {
	constructor(props) {
		super(props);
		this.time_remaining = 60;
		this.state = {
			account: null,
			code: null,
			verificationCode: null,
			submitting: false,
			tips: '发送验证码'
		};
	}

	//发送验证码
	sendVerificationCode = async () => {
		let result = {};
		if (Tools.regular(this.state.account)) {
			this.setState({
				submitting: true
			});
			try {
				result = await this.props.SendVerificationCodeMutation({
					variables: {
						account: this.state.account,
						action: 'USER_INFO_CHANGE'
					},
					errorPolicy: 'all'
				});
			} catch (ex) {
				result.errors = ex;
			}
			if (result && result.errors) {
				let str = result.errors[0].message;
				Toast.show({ content: str });
				this.setState({
					submitting: false
				});
			} else {
				this.countDown();
				console.log('results', result.data.sendVerificationCode);
				this.setState({
					submitting: false,
					verificationCode: result.data.sendVerificationCode.code
				});
			}
		} else {
			Toast.show({ content: '账号格式错误' });
		}
	};

	countDown = () => {
		this.timer = setInterval(() => {
			this.time_remaining--;
			if (this.time_remaining == 0) {
				this.time_remaining = 60;
				this.setState({
					tips: '重新发送验证码'
				});
				return false;
			}
			this.setState({
				tips: this.time_remaining + 's后重新发送'
			});
		}, 1000);
	};

	//提交修改账号
	setPaymentInfo = async () => {
		let { verificationCode, code, account } = this.state;
		const { navigation } = this.props;
		let result = {};
		if (Tools.regular(this.state.account)) {
			if (code == verificationCode) {
				this.setState({
					submitting: true
				});
				try {
					result = await this.props.UpdateUserAccountMutation({
						variables: {
							account: account
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

					navigation.pop(2);
					Toast.show({ content: '修改成功' });
				}
				this.setState({
					pay_account: ''
				});
			} else {
				Toast.show({ content: '验证码错误' });
			}
		} else {
			Toast.show({ content: '账号格式错误' });
		}
	};

	componentWillUpdate(nextProps, nextState) {
		if (this.tips == '重新发送验证码') {
			this.timer && clearInterval(this.timer);
		}
	}

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	render() {
		let { navigation } = this.props;
		const { code, account, submitting, tips } = this.state;
		return (
			<PageContainer title="验证账号" white submitting={submitting} submitTips="验证中...">
				<View style={styles.container}>
					<View style={{ marginTop: PxFit(50), paddingHorizontal: PxFit(25), paddingBottom: PxFit(15) }}>
						<Text style={{ color: Theme.black, fontSize: 20, fontWeight: '600', paddingBottom: PxFit(10) }}>
							修改账号
						</Text>
						<Text style={styles.tipsText}>账号一经修改将无法再更改</Text>
					</View>
					<View style={styles.textWrap}>
						<CustomTextInput
							placeholder="请输入新手机/邮箱号"
							style={{ height: PxFit(48) }}
							maxLength={32}
							keyboardType={'numeric'}
							onChangeText={value => {
								this.setState({
									account: value
								});
							}}
						/>
					</View>
					<View
						style={{
							marginHorizontal: PxFit(25),
							paddingHorizontal: 0,
							borderBottomWidth: PxFit(0.5),
							borderBottomColor: Theme.lightBorder,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
					>
						<CustomTextInput
							placeholder="验证码"
							style={{
								height: PxFit(48),
								width: SCREEN_WIDTH / 2
							}}
							maxLength={6}
							keyboardType={'numeric'}
							onChangeText={value => {
								this.setState({
									code: value
								});
							}}
						/>
						{/*<Button
							title={tips}
							style={{
								height: PxFit(28),
								width: 108,
								borderRadius: PxFit(5),
								backgroundColor: Theme.primaryColor
							}}
							onPress={this.sendVerificationCode}
						/>*/}
						<TouchFeedback
							onPress={this.sendVerificationCode}
							disabled={!(account && account.length > 0 && this.time_remaining == 60)}
						>
							<Text
								style={{
									color:
										account && account.length > 0 && this.time_remaining == 60
											? Theme.theme
											: Theme.grey
								}}
							>
								{tips}
							</Text>
						</TouchFeedback>
					</View>
					<Button title={'确认'} style={styles.button} onPress={this.setPaymentInfo} />
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
	textWrap: {
		marginHorizontal: PxFit(25),
		paddingHorizontal: 0,
		// marginTop: PxFit(2),
		borderBottomWidth: PxFit(0.5),
		borderBottomColor: Theme.lightBorder
	},
	button: {
		height: PxFit(38),
		borderRadius: PxFit(5),
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

export default compose(
	graphql(GQL.SendVerificationCodeMutation, { name: 'SendVerificationCodeMutation' }),
	graphql(GQL.UpdateUserAccountMutation, { name: 'UpdateUserAccountMutation' })
)(ModifyAccount);
