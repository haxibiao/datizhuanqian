/*
 * @Author: Gaoxuan
 * @Date:   2019-03-06 10:02:02
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button, Screen, SubmitLoading, Input } from '../../../components';
import { Colors } from '../../../constants';
import { Methods } from '../../../helpers';

import { connect } from 'react-redux';
import actions from '../../../store/actions';

import { ForgetPasswordMutation } from '../../../graphql/user.graphql';
import { Mutation, compose, graphql } from 'react-apollo';

import KeyboardSpacer from 'react-native-keyboard-spacer';

let countDown = 59;

class VerificationCodeScreen extends Component {
	constructor(props) {
		super(props);
		let { time } = this.props.navigation.state.params;
		this.state = {
			tips: `${time ? time : '60'}s后重新发送`,
			verification: null,
			isVisible: false
		};
	}
	componentDidMount() {
		console.log('this.tmer', this.timer);
		this.countDown();
	}

	componentWillUpdate(nextProps, nextState) {
		if (countDown == 0) {
			countDown = 60;
			this.setState({
				tips: '重新获取验证码'
			});
			this.timer && clearInterval(this.timer);
		}
	}

	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}

	countDown = () => {
		let { time } = this.props.navigation.state.params;
		countDown = time ? time : 60;
		this.timer = setInterval(() => {
			countDown--;
			this.setState({
				tips: `${countDown}s后重新发送`
			});
		}, 1000);
	};
	render() {
		const { navigation } = this.props;
		let { verification, tips, isVisible } = this.state;

		return (
			<Screen>
				<View style={styles.container}>
					<View style={{ marginTop: 50, paddingHorizontal: 25 }}>
						<Text style={{ color: Colors.black, fontSize: 20, fontWeight: '600' }}>输入验证码</Text>
						<Text style={{ color: Colors.grey, fontSize: 12, paddingTop: 20 }}>
							验证码已发送至 {this.props.users.user.account}
						</Text>
					</View>
					<Input
						placeholder="请输入收到的哈希表科技验证码"
						viewStyle={{ marginHorizontal: 25, paddingHorizontal: 0, marginTop: 30 }}
						defaultValue={this.state.verification}
						autoFocus
						keyboardType={'numeric'}
						changeValue={value => {
							this.setState({
								verification: value
							});
						}}
					/>
					<View style={{ marginHorizontal: 25, marginTop: 35, height: 48 }}>
						<Button
							name="确认"
							handler={this.sendVerificationCode}
							theme={Colors.theme}
							style={{ height: 38, fontSize: 16 }}
							disabled={verification ? false : true}
							disabledColor={Colors.tintGray}
						/>
					</View>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginHorizontal: 25,
							marginTop: 15
						}}
					>
						<TouchableOpacity onPress={this.resendVerificationCode} disabled={!(countDown == 60)}>
							<Text style={{ color: countDown == 60 ? Colors.theme : Colors.grey, fontSize: 13 }}>
								{this.state.tips}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity>
							<Text style={{ color: Colors.grey, fontSize: 13 }}>账号有误?</Text>
						</TouchableOpacity>
					</View>
				</View>
				<SubmitLoading isVisible={isVisible} tips={'提交中...'} />
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
	compose(graphql(ForgetPasswordMutation, { name: 'ForgetPasswordMutation' }))(VerificationCodeScreen)
);
