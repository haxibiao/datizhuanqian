import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";
import Toast from "react-native-root-toast";

import Screen from "../../Screen";

import { Button } from "../../../components/Control";

import { Colors, Methods } from "../../../constants";
import { connect } from "react-redux";
import actions from "../../../store/actions";

import { UpdateUserPasswordMutation } from "../../../graphql/user.graphql";
import { Mutation } from "react-apollo";

class ChangePasswordScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldPassword: "",
			password: "",
			disabled: true,
			againpassword: ""
		};
	}

	render() {
		const { navigation } = this.props;
		let { oldPassword, password, disabled, againpassword } = this.state;
		console.log("old", oldPassword, password);
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
							placeholder="请输入旧密码"
							placeholderText={Colors.tintFontColor}
							selectionColor={Colors.themeColor}
							style={styles.textInput}
							onChangeText={oldPassword => {
								this.setState({ oldPassword });
							}}
							// maxLength={10}
							secureTextEntry={true}
							maxLength={16}
						/>
					</View>
					<View style={styles.textWrap}>
						<TextInput
							textAlignVertical="center"
							underlineColorAndroid="transparent"
							placeholder="请输入新密码,不少于6位"
							placeholderText={Colors.tintFontColor}
							selectionColor={Colors.themeColor}
							style={styles.textInput}
							onChangeText={password => {
								this.setState({ password });
							}}
							secureTextEntry={true}
							maxLength={16}
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
							maxLength={16}
						/>
					</View>
					<View style={{ margin: 20, height: 48 }}>
						<Mutation mutation={UpdateUserPasswordMutation}>
							{updateUserPassword => {
								return (
									<Button
										name="完成"
										handler={() => {
											if (password.indexOf(" ") >= 0) {
												Methods.toast("密码格式错误", 70);
											} else {
												if (password == againpassword) {
													updateUserPassword({
														variables: {
															old_password: oldPassword,
															new_password: password
														}
													});
													Methods.toast("新密码设置成功");
													navigation.goBack();
												} else {
													Methods.toast("两次输入的密码不一致");
												}
											}
										}}
										style={{ height: 38, fontSize: 16 }}
										disabled={
											oldPassword && password.length > 5 && againpassword.length > 5
												? false
												: true
										}
										disabledColor={"rgba(255,177,0,0.7)"}
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
}))(ChangePasswordScreen);
