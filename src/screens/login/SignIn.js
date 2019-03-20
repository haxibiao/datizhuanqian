/*
 * @flow
 * created by wyk made in 2019-03-20 16:53:49
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
	PageContainer,
	ScrollTabBar,
	Button,
	CustomTextInput,
	TouchFeedback,
	Iconfont,
	AnimationButton
} from '../../components';
import { Theme, PxFit, SCREEN_WIDTH, ISIOS } from '../../utils';

var showThumbType = ['accpunt', 'password'];
class SignIn extends Component {
	constructor(props) {
		super(props);

		this.state = {
			secure: true,
			showThumb: false
		};
	}

	render() {
		let { changeAccount, changePassword } = this.props;
		let { secure, showThumb } = this.state;
		return (
			<View>
				<View style={styles.fieldGroup}>
					<Text style={styles.field}>账号</Text>
					<View style={styles.inputWrap}>
						<CustomTextInput
							placeholderTextColor="#666"
							autoCorrect={false}
							placeholder="请输入邮箱号"
							keyboardType="email-address"
							style={styles.inputStyle}
							onChangeText={changeAccount}
							onFocus={() => this.setState({ showThumb: showThumbType[0] })}
						/>

						{showThumb == showThumbType[0] && (
							<TouchFeedback onPress={() => changeAccount('')}>
								<Iconfont
									name={'close'}
									size={PxFit(20)}
									color={secure ? Theme.tintTextColor : Theme.primaryAuxiliaryColor}
								/>
							</TouchFeedback>
						)}
					</View>
				</View>
				<View style={styles.fieldGroup}>
					<Text style={styles.field}>密码</Text>
					<View style={styles.inputWrap}>
						<CustomTextInput
							placeholderTextColor="#666"
							autoCorrect={false}
							placeholder="请输入密码"
							secureTextEntry={secure}
							style={styles.inputStyle}
							onChangeText={changePassword}
							onFocus={() => this.setState({ showThumb: showThumbType[1] })}
						/>
						{showThumb == showThumbType[1] && (
							<TouchFeedback onPress={() => this.setState({ secure: !secure })}>
								<Iconfont
									name={secure ? 'eye' : 'hide'}
									size={PxFit(20)}
									color={secure ? Theme.tintTextColor : Theme.primaryAuxiliaryColor}
								/>
							</TouchFeedback>
						)}
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	fieldGroup: {
		marginBottom: PxFit(10)
	},
	field: {
		fontSize: PxFit(15),
		color: Theme.subTextColor
	},
	inputWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: PxFit(8),
		borderBottomWidth: PxFit(1),
		borderBottomColor: Theme.subTextColor
	},
	inputStyle: {
		flex: 1,
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		paddingTop: PxFit(12),
		paddingBottom: PxFit(12)
	}
});

export default SignIn;
