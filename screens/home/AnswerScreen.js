import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";

import { DivisionLine } from "../../components/Universal";
import { Colors } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";

import { connect } from "react-redux";
import actions from "../../store/actions";

class AnswerScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			i: 0,
			value: null
		};
	}
	render() {
		const { question } = this.props;
		const { i, value } = this.state;
		console.log("question0", question);
		return (
			<Screen routeName={"答题"}>
				<DivisionLine height={10} />
				<View style={styles.container}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							paddingVertical: 15
						}}
					>
						<Text style={{ color: Colors.orange }}>智慧点价值 {question[i].value}</Text>
						<View>
							<Image
								style={{ height: 40, width: 40 }}
								source={{ uri: "http://pic40.photophoto.cn/20160811/0007020070469426_b.jpg" }}
							/>
						</View>
					</View>
					<View>
						<Text style={{ color: Colors.primaryFont, fontSize: 16 }}>{question[i].title}</Text>
						<View style={{ paddingTop: 30 }}>
							<TouchableOpacity
								style={styles.option}
								onPress={() => {
									this.setState({
										value: 1
									});
								}}
							>
								<Text>{question[i].option.a}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.option}
								onPress={() => {
									this.setState({
										value: 2
									});
								}}
							>
								<Text>{question[i].option.b}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.option}
								onPress={() => {
									this.setState({
										value: 3
									});
								}}
							>
								<Text>{question[i].option.c}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.option}
								onPress={() => {
									this.setState({
										value: 4
									});
								}}
							>
								<Text>{question[i].option.d}</Text>
							</TouchableOpacity>
						</View>
					</View>
					{value && (
						<View style={{ flexDirection: "row", justifyContent: "center", marginTop: 15 }}>
							<Text
								style={
									question[i].answer == this.state.value
										? { color: Colors.weixin }
										: { color: "#ff0000" }
								}
							>
								{question[i].answer == this.state.value ? "回答正确" : "回答错误"}
							</Text>
						</View>
					)}
					<TouchableOpacity
						style={{
							marginTop: 40,
							borderRadius: 5,
							backgroundColor: "#407FCF",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							paddingVertical: 10
						}}
						onPress={() => {
							this.setState({
								i: i + 1
							});
						}}
					>
						<Text style={{ color: Colors.white }}>搜一搜答案</Text>
					</TouchableOpacity>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
		paddingHorizontal: 30
	},
	option: {
		marginTop: 10,
		borderWidth: 1,
		borderColor: Colors.lightBorder,
		borderRadius: 5,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 10
	}
});

export default connect(store => {
	return {
		question: store.question.question
	};
})(AnswerScreen);
