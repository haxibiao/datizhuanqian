import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions, TextInput } from "react-native";

import { Methods, Colors } from "../../constants";
import { Iconfont } from "../../utils/Fonts";
import { DivisionLine } from "../../components/Universal";
import { Button } from "../../components/Control";

import Screen from "../Screen";

import { CreateFeedbackMutation } from "../../graphql/user.graphql";
import { Mutation } from "react-apollo";

const { width, height } = Dimensions.get("window");

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			content: null,
			contact: null
		};
	}

	render() {
		let { content, contact } = this.state;
		const { navigation } = this.props;
		return (
			<Screen customStyle={{ borderBottomColor: "transparent", backgroundColor: Colors.theme }}>
				<View style={styles.container}>
					{/*<Text style={{ paddingHorizontal: 15, paddingVertical: 10, color: Colors.gery }}>反馈内容</Text>*/}

					<View
						style={{
							borderBottomWidth: 1,
							borderBottomColor: Colors.lightBorder,
							marginHorizontal: 15,
							paddingVertical: 15
						}}
					>
						<TextInput
							ref="textInput"
							style={styles.input}
							placeholder="请简要描述您的问题和意见,我们将为您不断改进"
							underlineColorAndroid="transparent"
							selectionColor="#000"
							multiline={true}
							textAlignVertical={"top"}
							onChangeText={content => {
								this.setState({ content: content });
							}}
						/>
					</View>

					<View style={{ backgroundColor: Colors.white }}>
						<TextInput
							ref="textInput"
							style={{
								height: 44,
								paddingHorizontal: 15,
								padding: 0,
								paddingTop: 15,
								fontSize: 13
							}}
							placeholder="微信/QQ/邮箱"
							underlineColorAndroid="transparent"
							selectionColor="#000"
							multiline={true}
							textAlignVertical={"top"}
							onChangeText={contact => {
								this.setState({ contact: contact });
							}}
						/>
					</View>
					<Mutation mutation={CreateFeedbackMutation}>
						{CreateFeedbackMutation => {
							return (
								<Button
									name={"提交"}
									style={{ height: 42, marginHorizontal: 20, marginBottom: 20 }}
									theme={content ? Colors.blue : Colors.tintGray}
									textColor={content ? Colors.white : Colors.grey}
									handler={() => {
										CreateFeedbackMutation({
											variables: {
												content: content,
												contact: contact
											}
										});
										navigation.goBack();
										Methods.toast("反馈成功", -180);
									}}
								/>
							);
						}}
					</Mutation>
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
	input: {
		backgroundColor: "transparent",
		fontSize: 15,
		padding: 0,
		height: 260,
		justifyContent: "flex-start"
		// marginTop:10,
	}
});

export default HomeScreen;
