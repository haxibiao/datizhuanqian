import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Screen } from 'react-native';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../Helpers';
import { Button, LoginInput } from '../../components';

class SignIn extends Component {
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

	//登录
	signIn = () => {
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
					<View>
						<LoginInput
							name={'user'}
							keys={'account'}
							focusItem={focusItem}
							value={this.accountState.account}
							focusKey={this.focusKey}
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
							focusKey={this.focusKey}
							placeholder={'密码'}
							changeValue={this.changeValue}
							maxLength={16}
						/>
					</View>
					<View style={styles.centerRight}>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('验证');
							}}
						>
							<Text style={styles.rightText}>忘记密码？</Text>
						</TouchableOpacity>
					</View>
					<Button
						name={'登录'}
						disabled={disableSubmit}
						handler={this.signIn}
						style={{ height: 42, marginTop: 20 }}
						theme={Colors.theme}
						fontSize={17}
						disabledColor={'rgba(255,177,0,0.7)'}
					/>
				</View>
				<View style={styles.footer}>
					<Text style={styles.footerText}>还没有账号？</Text>
					<TouchableOpacity onPress={switchView}>
						<Text style={styles.signUp}>注册</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	focusKey(key) {
		this.setState({ focusItem: key });
	}

	changeValue(key, value) {
		this.accountState[key] = value;
		if (this.accountState.account && this.accountState.password) {
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
		marginTop: 20,
		marginBottom: 20,
		alignItems: 'center'
	},
	logo: {
		width: Divice.width / 4,
		height: Divice.width / 4
	},
	centerRight: {
		marginTop: 10,
		alignItems: 'flex-end'
	},
	rightText: {
		fontSize: 14,
		color: Colors.tintFont
	},
	footer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 15,
		flexDirection: 'row'
	},
	footerText: {
		fontSize: 16,
		color: Colors.tintFontColor
	},
	signUp: {
		fontSize: 16,
		color: Colors.theme
	}
});

export default SignIn;
