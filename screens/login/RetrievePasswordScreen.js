import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";
import Toast from "react-native-root-toast";

import Screen from "../Screen";

import { Button } from "../../components/Control";

import { Colors, Methods } from "../../constants";
import { connect } from "react-redux";
import actions from "../../store/actions";

import { ResetPasswordMutation } from "../../graphql/user.graphql";
import { Mutation } from "react-apollo";

class RetrievePasswordScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			verification: "",
			password: "",
			disabled: true,
			againpassword: ""
		};
	}

	render() {
		const { navigation } = this.props;
		let { verification, password, disabled, againpassword } = this.state;
		const { result, account } = navigation.state.params;
		console.log("result ", result);
		return (
			<Screen>
				<View style={styles.container}>
					<View
						style={{
							height: 20,
							backgroundColor: Colors.skinColor,
							borderBottomWidth: 1,
							borderBottomColor: Colors.lightBorder
						}}
					/>
					<View style={styles.textWrap}>
						<TextInput
							textAlignVertical="center"
							underlineColorAndroid="transparent"
							placeholder="请输入验证码"
							placeholderText={Colors.tintFontColor}
							selectionColor={Colors.themeColor}
							style={styles.textInput}
							onChangeText={verification => {
								this.setState({ verification });
							}}
							maxLength={10}
						/>
						{/*<TouchableOpacity>
							<View style={styles.repeat}>
								<Text
									style={{
										backgroundColor: Colors.theme,
										fontSize: 14,
										color: Colors.skinColor,
										paddingHorizontal: 15,
										paddingVertical: 9,
										borderRadius: 4
									}}
								>
									重发
								</Text>
							</View>
						</TouchableOpacity>*/}
					</View>
					<View style={styles.textWrap}>
						<TextInput
							textAlignVertical="center"
							underlineColorAndroid="transparent"
							placeholder="请输入新密码"
							placeholderText={Colors.tintFontColor}
							selectionColor={Colors.themeColor}
							style={styles.textInput}
							onChangeText={password => {
								this.setState({ password });
							}}
							secureTextEntry={true}
						/>
					</View>
					<View style={styles.textWrap}>
						<TextInput
							textAlignVertical="center"
							underlineColorAndroid="transparent"
							placeholder="请再次输入新密码"
							placeholderText={Colors.tintFontColor}
							selectionColor={Colors.themeColor}
							style={styles.textInput}
							onChangeText={againpassword => this.setState({ againpassword })}
							secureTextEntry={true}
						/>
					</View>
					<View style={{ margin: 20, height: 48 }}>
						<Mutation mutation={ResetPasswordMutation}>
							{ResetPasswordMutation => {
								return (
									<Button
										name="完成"
										handler={() => {
											if (result[0] == verification) {
												if (password == againpassword) {
													ResetPasswordMutation({
														variables: {
															account: account,
															password: password,
															token: result[1]
														}
													});
													Methods.toast("新密码设置成功");
													navigation.pop(2);
												} else {
													Methods.toast("两次输入的密码不一致");
												}
											} else {
												Methods.toast("验证码错误,请输入正确的验证码");
											}
										}}
										style={{ height: 38, fontSize: 16 }}
										disabled={verification && password && againpassword ? false : true}
									/>
								);
							}}
						</Mutation>
					</View>
				</View>
			</Screen>
		);
	}
	toast(message) {
		let toast = Toast.show(message, {
			duration: Toast.durations.LONG,
			position: -20,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 100,
			backgroundColor: Colors.nightColor
		});
		setTimeout(function() {
			Toast.hide(toast);
		}, 2000);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	textWrap: {
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorder,
		position: "relative"
	},
	textInput: {
		fontSize: 16,
		color: Colors.primaryFont,
		padding: 0,
		height: 50
	},
	repeat: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		right: 15,
		top: 7
	}
});

export default connect(store => ({
	user: store.users.user
}))(RetrievePasswordScreen);
