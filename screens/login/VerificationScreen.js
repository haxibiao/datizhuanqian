import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";

import Screen from "../Screen";

import { Button } from "../../components/Control";

import Colors from "../../constants/Colors";
import { connect } from "react-redux";
import actions from "../../store/actions";

import { ForgotPasswordMutation } from "../../graphql/user.graphql";
import { Mutation, compose } from "react-apollo";

class VerificationEmailScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			account: ""
		};
	}

	render() {
		const { navigation } = this.props;
		let { account } = this.state;
		console.log("account ", account);

		return (
			<Screen>
				<View style={styles.container}>
					<View style={styles.textWrap}>
						<TextInput
							textAlignVertical="center"
							underlineColorAndroid="transparent"
							placeholder="请输入注册时的邮箱地址"
							placeholderText={Colors.tintFont}
							selectionColor={Colors.theme}
							style={styles.textInput}
							onChangeText={account => {
								this.setState({ account });
							}}
						/>
					</View>
					<View style={{ margin: 20, height: 48 }}>
						<Mutation mutation={ForgotPasswordMutation}>
							{ForgotPasswordMutation => {
								return (
									<Button
										name="发送验证码"
										handler={() => {
											ForgotPasswordMutation({
												variables: {
													account: account
												}
											});
											navigation.navigate("找回密码");
										}}
										style={{ height: 38, fontSize: 16 }}
										disabled={account ? false : true}
									/>
								);
							}}
						</Mutation>
					</View>
				</View>
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
		marginTop: 20,
		paddingHorizontal: 20,
		borderTopWidth: 1,
		borderTopColor: Colors.lightBorder,
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

export default connect(store => store)(VerificationEmailScreen);
