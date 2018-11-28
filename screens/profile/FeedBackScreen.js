import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions, TextInput } from "react-native";

import Colors from "../../constants/Colors";
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
					<View style={{ backgroundColor: Colors.white }}>
						<TextInput
							ref="textInput"
							style={styles.input}
							placeholder="请输入反馈,我们将为你不断改进"
							underlineColorAndroid="transparent"
							selectionColor="#000"
							multiline={true}
							textAlignVertical={"top"}
							onChangeText={content => {
								this.setState({ content: content });
							}}
						/>
					</View>
					<DivisionLine height={10} />
					<View style={{ backgroundColor: Colors.white, marginBottom: 200 }}>
						<TextInput
							ref="textInput"
							style={{
								height: 44,
								paddingHorizontal: 15,
								padding: 0,
								paddingTop: 15,
								fontSize: 13
							}}
							placeholder="(选填)请留下您的联系方式,以便我们向您反馈处理结果"
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
									style={{ height: 40, marginHorizontal: 20, marginTop: 20 }}
									theme={content ? Colors.blue : Colors.grey}
									handler={() =>
										CreateFeedbackMutation({
											variables: {
												content: content,
												contact: contact
											}
										})
									}
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
		backgroundColor: Colors.lightGray
	},
	input: {
		backgroundColor: "transparent",
		fontSize: 14,
		padding: 0,
		paddingLeft: 20,
		paddingTop: 20,
		height: 260,
		justifyContent: "flex-start"
		// marginTop:10,
	}
});

export default HomeScreen;
