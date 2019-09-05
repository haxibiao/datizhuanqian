/*
 * @Author: Gaoxuan
 * @Date:   2019-03-20 14:41:10
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Platform } from 'react-native';
import { Button, TouchFeedback } from 'components';
import { Config, Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { Overlay } from 'teaset';
import { graphql, compose, GQL, withApollo } from 'apollo';
import { app } from 'store';
import { rest } from 'api';
import DeviceInfo from 'react-native-device-info';

class UserRewardOverlay extends Component {
	constructor(props) {
		super(props);
		this.state = {
			reportContent: {
				category: '注册奖励',
				action: 'user_auto_sign_in',
				name: '静默注册奖励',
				value: '1',
				package: Config.PackageName,
				os: Platform.OS,
				version: Config.Version,
				build: Config.Build,
				user_id: DeviceInfo.getUniqueID(),
				referrer: Config.AppStore
			}
		};
	}

	componentDidMount() {
		let data = JSON.stringify(this.state.reportContent);

		rest.dataReport(data, result => {
			console.log('result', result);
		});
	}

	handleLogin = async () => {
		const { navigation, phone, client } = this.props;
		let deviceId = DeviceInfo.getUniqueID();

		let phoneNumber = null;
		if (phone) {
			phoneNumber = phone.substr(phone.length - 11);
		}

		if (phoneNumber || deviceId) {
			//静默注册
			let result = client
				.mutate({
					mutation: GQL.autoSignInMutation,
					variables: {
						account: phoneNumber,
						uuid: deviceId
					}
				})
				.then(result => {
					let canSignIn = result && result.data && result.data.autoSignIn;
					if (canSignIn) {
						let user = result.data.autoSignIn;
						app.signIn(user);
						let router = !(user.auto_uuid_user && user.auto_phone_user) ? '答题' : '提现';
						let content = !(user.auto_uuid_user && user.auto_phone_user)
							? '欢迎回家，继续享受答题赚钱吧'
							: '领取奖励成功，绑定支付宝即可提现';

						navigation.navigate(router);
						Toast.show({ content });
					} else {
						navigation.navigate('Login');
					}
				})
				.catch(error => {
					console.log('err', error);
					Toast.show({ content: error.toString() });
					navigation.navigate('Login');
				});
		} else {
			//手动去注册登录
			navigation.navigate('Login');
		}
	};

	render() {
		return (
			<TouchFeedback
				style={{
					width: SCREEN_WIDTH - PxFit(90),
					borderRadius: PxFit(15),
					backgroundColor: 'transparent',
					alignItems: 'center'
				}}
				onPress={() => {
					this.props.hide();
					this.handleLogin();
				}}
			>
				<Image
					source={require('../../../assets/images/new_user_reward.png')}
					style={{ width: (SCREEN_WIDTH * 4) / 5, height: (((SCREEN_WIDTH * 4) / 5) * 640) / 519 }}
				/>
			</TouchFeedback>
		);
	}
}

const styles = StyleSheet.create({
	text: {
		paddingVertical: PxFit(2),
		lineHeight: PxFit(18),
		fontSize: PxFit(12),
		color: Theme.subTextColor
	},
	buttonText: {
		width: SCREEN_WIDTH / 2,
		height: PxFit(38),
		borderRadius: PxFit(19),
		marginTop: PxFit(15),
		backgroundColor: Theme.primaryColor
	}
});

export default UserRewardOverlay;
