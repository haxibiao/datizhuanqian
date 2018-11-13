import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";
import Toast from "react-native-root-toast";

import Screen from "../Screen";

import { Button } from "../../components/Control";

import Colors from "../../constants/Colors";
import { connect } from "react-redux";
import actions from "../../store/actions";

class RetrievePasswordScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			verificationcode: "",
			password: "",
			disabled: true,
			againpassword: ""
		};
	}

	render() {
		let { verificationcode, password, disabled, againpassword } = this.state;
		let { navigation } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<View
						style={{
							height: 20,
							backgroundColor: Colors.skinColor,
							borderBottomWidth: 1,
							borderBottomColor: Colors.lightBorderColor
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
							onChangeText={verificationcode => {
								this.setState({ verificationcode });
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
						<Button
							name="完成"
							handler={() => {
								if (password == againpassword) {
									updateUserPassword({
										variables: {
											verificationcode,
											password
										}
									});
								} else {
									this.toast("两次输入的密码不一致");
									return null;
								}
								this.props.dispatch(actions.updatePassword(password));
								navigation.goBack();
							}}
							disabled={verificationcode && password && againpassword ? false : true}
						/>
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
		backgroundColor: Colors.skinColor
	},
	textWrap: {
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor,
		position: "relative"
	},
	textInput: {
		fontSize: 16,
		color: Colors.primaryFontColor,
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
	user: store.user.user
}))(RetrievePasswordScreen);
