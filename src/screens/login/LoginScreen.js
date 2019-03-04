import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Colors, Config, Divice } from '../../constants';
import { Methods } from '../../helpers';
import { Screen, Iconfont, SubmitLoading } from '../../components';

import SignIn from './SignIn';
import SignUp from './SignUp';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { signUpMutation, signInMutation, UserQuery } from '../../graphql/user.graphql';
import { graphql, compose } from 'react-apollo';

import KeyboardSpacer from 'react-native-keyboard-spacer';

class LoginScreen extends Component {
	constructor(props) {
		super(props);
		let login = props.navigation.getParam('login', false);
		this.state = {
			login,
			isVisible: false
		};
	}

	//处理表单提交
	handleSubmit = async childState => {
		const { account, password } = childState;
		this.setState({
			isVisible: true
		});
		if (!this.state.login) {
			//登录
			let result = {};
			try {
				result = await this.props.signInMutation({
					variables: {
						account,
						password
					}
				});
			} catch (ex) {
				result.errors = ex;
			}
			if (result && result.errors) {
				let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
				Methods.toast(str, 80); //Toast错误信息
			} else {
				const user = result.data.signIn;
				this._saveUserData(user);
			}
			this.setState({
				isVisible: false
			});
		} else {
			//注册
			let result = {};
			try {
				result = await this.props.signUpMutation({
					variables: {
						account,
						password
					}
				});
			} catch (ex) {
				result.errors = ex;
			}
			if (result && result.errors) {
				let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
				Methods.toast(str, 80); //Toast错误信息
			} else {
				const user = result.data.signUp;
				this._saveUserData(user);
			}
			this.setState({
				isVisible: false
			});
		}
	};

	_saveUserData = user => {
		this.props.dispatch(actions.signIn(user));
		this.props.navigation.goBack();
	};

	switchView() {
		this.setState(prevState => ({ login: !prevState.login }));
	}
	render() {
		const { login, isVisible } = this.state;
		const { navigation } = this.props;
		return (
			<Screen header>
				<View style={{ marginTop: 40, alignItems: 'flex-start', paddingLeft: 20 }}>
					<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
						<Iconfont name={'close'} size={24} color={Colors.tintFontColor} style={{ fontWeight: '300' }} />
					</TouchableOpacity>
				</View>
				{login ? (
					<SignUp
						switchView={this.switchView.bind(this)}
						navigation={navigation}
						handleSubmit={this.handleSubmit}
					/>
				) : (
					<SignIn
						switchView={this.switchView.bind(this)}
						navigation={navigation}
						handleSubmit={this.handleSubmit}
					/>
				)}
				<KeyboardSpacer />
				<SubmitLoading isVisible={isVisible} />
			</Screen>
		);
	}
}

const styles = StyleSheet.create({});

export default connect(store => {
	return { ...store };
})(
	compose(
		graphql(signUpMutation, { name: 'signUpMutation' }),
		graphql(signInMutation, { name: 'signInMutation' })
	)(LoginScreen)
);
