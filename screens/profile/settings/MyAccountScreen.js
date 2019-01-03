import React, { Component } from "react";
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, StatusBar, TextInput } from "react-native";

import Screen from "../../Screen";

import { Header } from "../../../components/Header";
import { DivisionLine, Avatar } from "../../../components/Universal";
import { Button } from "../../../components/Control";
import { Iconfont } from "../../../utils/Fonts";

import { Colors, Methods } from "../../../constants";

import { connect } from "react-redux";
import actions from "../../../store/actions";
import { SetUserPaymentInfoMutation } from "../../../graphql/withdraws.graphql";
import { Mutation } from "react-apollo";

class EditProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			real_name: this.props.user.name,
			pay_account: null
		};
	}

	render() {
		let { navigation, user } = this.props;
		const { real_name, pay_account } = this.state;
		// const { user } = navigation.state.params;
		console.log("user", user);
		return (
			<Screen header>
				<Header customStyle={{ borderBottomColor: "transparent" }} />
				<DivisionLine height={10} />
				<View style={styles.container}>
					<View style={{ paddingHorizontal: 15, marginVertical: 15 }}>
						<Text style={{ fontWeight: "300", color: Colors.grey, lineHeight: 20 }}>
							支付宝账号为提现有效证据,请输入已经通过实名认证的支付宝账号,否则提现将失败.
						</Text>
					</View>
					<TextInput
						ref="textInput"
						style={{
							height: 44,
							paddingHorizontal: 15,
							padding: 0,
							paddingTop: 15,
							borderTopWidth: 1,
							borderTopColor: Colors.lightBorder,
							borderBottomWidth: 1,
							borderBottomColor: Colors.lightBorder
						}}
						editable={user.name}
						placeholder={user.name ? user.name : "请输入支付宝姓名"}
						underlineColorAndroid="transparent"
						selectionColor="#000"
						multiline={true}
						autoCapitalize={"none"}
						onChangeText={real_name => {
							this.setState({ real_name: real_name });
						}}
					/>
					<TextInput
						ref="textInput"
						style={{
							height: 44,
							paddingHorizontal: 15,
							padding: 0,
							paddingTop: 15,
							borderBottomWidth: 1,
							borderBottomColor: Colors.lightBorder
						}}
						placeholder="请输入支付宝账号"
						underlineColorAndroid="transparent"
						selectionColor="#000"
						multiline={true}
						autoCapitalize={"none"}
						onChangeText={pay_account => {
							this.setState({ pay_account: pay_account });
						}}
					/>
					<Mutation mutation={SetUserPaymentInfoMutation}>
						{SetUserPaymentInfoMutation => {
							return (
								<Button
									name={"提交"}
									style={{ height: 40, marginHorizontal: 15, marginTop: 20 }}
									disabled={!(real_name && pay_account)}
									theme={real_name && pay_account ? Colors.theme : "rgba(64,127,207,0.7)"}
									handler={() => {
										SetUserPaymentInfoMutation({
											variables: {
												real_name,
												pay_account
											}
										});
										Methods.toast("绑定成功", -200);
										this.props.dispatch(
											actions.updateAlipay({ real_name: real_name, pay_account: pay_account })
										);
										navigation.goBack();
									}}
								/>
							);
						}}
					</Mutation>
					<View style={{ paddingHorizontal: 15 }}>
						<Text style={{ fontSize: 14, color: Colors.red, paddingTop: 15 }}>
							注意:支付宝账号一旦绑定将无法更改！
						</Text>
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
	}
});

export default connect(store => ({ user: store.users.user }))(EditProfileScreen);
