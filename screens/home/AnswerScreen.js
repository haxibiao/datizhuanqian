import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";

import { DivisionLine, TabTop } from "../../components/Universal";
import { Button } from "../../components/Control";
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
			value: null,
			counts: props.user
		};
	}
	render() {
		const { question, navigation, prop } = this.props;
		const { i, value, counts } = this.state;
		const { plate_id } = navigation.state.params;
		console.log("plate_id", plate_id);
		return (
			<Screen routeName={"答题"}>
				<TabTop user={counts} />
				<View style={styles.container}>
					<View style={styles.top}>
						<Text style={{ color: Colors.orange }}>智慧点价值 {question[i].value}</Text>

						<View style={styles.topRight}>
							{prop.map((prop, index) => {
								return <Image style={styles.img} source={{ uri: prop.logo }} key={index} />;
							})}
						</View>
					</View>
					<View>
						<Text style={styles.title}>{question[i].title}</Text>
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
						<View style={styles.tips}>
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
					<Button
						name={"搜一搜答案"}
						style={{ height: 34, marginTop: 40 }}
						theme={Colors.blue}
						fontSize={14}
					/>
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
	top: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 15
	},
	topRight: {
		flexDirection: "row",
		alignItems: "center"
	},
	img: {
		height: 40,
		width: 40
	},
	title: {
		color: Colors.primaryFont,
		fontSize: 16
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
	},
	tips: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15
	}
});

export default connect(store => {
	return {
		question: store.question.question,
		prop: store.question.prop,
		user: store.user.personal
	};
})(AnswerScreen);
