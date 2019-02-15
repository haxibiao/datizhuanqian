import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { Button, LoginInput } from '../../components';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';

class SignUp extends Component {
	constructor(props) {
		super(props);
		this.focusKey = this.focusKey.bind(this);
		this.changeValue = this.changeValue.bind(this);
		this.emptyValue = this.emptyValue.bind(this);
		this.accountState = {
			account: '',
			password: ''
		};
		this.state = {
			focusItem: 'account',
			modalVisible: false,
			disableSubmit: true,
			img: require('../../../assets/images/logo.png')
		};
	}

	//注册
	signUp = () => {
		let { handleSubmit } = this.props;

		if (Methods.regular(this.accountState.account) && this.accountState.password.indexOf(' ') < 0) {
			handleSubmit(this.accountState);
		} else {
			Methods.toast('账号或密码错误', 80);
		}
	};

	render() {
		let { focusItem, modalVisible, disableSubmit, img } = this.state;
		let { switchView, handleSubmit, navigation } = this.props;
		return (
			<View style={styles.container}>
				<View style={styles.top}>
					<Image source={img} style={styles.logo} />
				</View>
				<View>
					<LoginInput
						name={'user'}
						keys={'account'}
						focusItem={focusItem}
						value={this.accountState.account}
						focusKey={this.focusKey.bind(this)}
						emptyValue={this.emptyValue}
						placeholder={'手机号码/邮箱'}
						changeValue={this.changeValue}
					/>
					<LoginInput
						name={'lock'}
						keys={'password'}
						focusItem={focusItem}
						value={this.accountState.password}
						secure={true}
						focusKey={this.focusKey.bind(this)}
						placeholder={'设置密码,不少于6位'}
						changeValue={this.changeValue}
						maxLength={16}
					/>
					{/*<LoginInput
						name={"lock"}
						keys={"verificationCode"}
						value={this.accountState.verificationCode}
						focusKey={this.focusKey.bind(this)}
						placeholder={"请输入验证码"}
						code={true}
						// changeValue={this.changeValue}
						// customStyle={{
						// 	borderTopWidth: 0,
						// 	borderBottomLeftRadius: 3,
						// 	borderBottomRightRadius: 3
						// }}
					/>*/}
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('用户协议');
						}}
						style={{ alignItems: 'flex-end', marginTop: 15 }}
					>
						<Text style={{ fontSize: 14, color: Colors.grey }}>用户协议</Text>
					</TouchableOpacity>
					<Button
						name={'同意协议并注册'}
						disabled={disableSubmit}
						handler={this.signUp}
						style={{ height: 42, marginTop: 15 }}
						theme={Colors.theme}
						fontSize={17}
						disabledColor={'rgba(255,177,0,0.7)'}
					/>
				</View>
				<TouchableOpacity onPress={switchView} style={styles.footer}>
					<Text style={styles.footerText}>已有账号登录</Text>
				</TouchableOpacity>
			</View>
		);
	}

	focusKey(key) {
		this.setState({ focusItem: key });
	}

	changeValue(key, value) {
		this.accountState[key] = value;
		if (this.accountState.account && this.accountState.password.length > 5) {
			this.setState({ disableSubmit: false });
		} else if (!this.state.disableSubmit) {
			this.setState({ disableSubmit: true });
		}
	}

	emptyValue(key) {
		this.accountState[key] = '';
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
		paddingHorizontal: 25,
		paddingVertical: 15,
		justifyContent: 'space-between'
	},
	top: {
		marginVertical: 20,
		alignItems: 'center'
	},
	logo: {
		width: Divice.width / 4,
		height: Divice.width / 4
	},
	footer: {
		alignItems: 'center',
		marginVertical: 15
	},
	footerText: {
		fontSize: 16,
		color: Colors.theme
	}
});

export default SignUp;
