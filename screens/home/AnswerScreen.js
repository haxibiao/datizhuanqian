import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, Animated } from "react-native";

import { DivisionLine, TabTop } from "../../components/Universal";
import { Button } from "../../components/Control";
import { CorrectModal } from "../../components/Modal";
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
			isMethod: false,
			value: null,
			isShow: false,
			counts: props.user,
			showColor: Colors.theme,
			name: "提交答案"
		};
	}
	render() {
		const { question, navigation, prop } = this.props;
		const { i, value, counts, isMethod, isShow, showColor, name } = this.state;
		const { plate_id } = navigation.state.params;
		return (
			<Screen routeName={"答题"}>
				<TabTop user={counts} />
				<View style={styles.container}>
					<View style={styles.top}>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Iconfont name={"zhuanshi"} size={18} color={Colors.theme} />
							<Text style={{ color: Colors.theme }}>智慧点价值 {question[i].value}</Text>
						</View>

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
								disabled={isMethod}
								style={[
									styles.option,
									{
										borderColor: value == 1 ? showColor : Colors.lightBorder
									}
								]}
								onPress={() => {
									this.setState({
										value: 1
									});
								}}
							>
								<Text>{question[i].option.a}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								disabled={isMethod}
								style={[
									styles.option,
									{
										borderColor: value == 2 ? showColor : Colors.lightBorder
									}
								]}
								onPress={() => {
									this.setState({
										value: 2
									});
								}}
							>
								<Text>{question[i].option.b}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								disabled={isMethod}
								style={[
									styles.option,
									{
										borderColor: value == 3 ? showColor : Colors.lightBorder
									}
								]}
								onPress={() => {
									this.setState({
										value: 3
									});
								}}
							>
								<Text>{question[i].option.c}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								disabled={isMethod}
								style={[
									styles.option,
									{
										borderColor: value == 4 ? showColor : Colors.lightBorder
									}
								]}
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
					<View style={{ height: 82, justifyContent: "space-between" }}>
						{isShow ? (
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
						) : (
							<Text />
						)}
						<Button
							name={name}
							disabled={value ? false : true}
							handler={() => {
								if (!isMethod) {
									this.setState({
										isMethod: true,
										name: "下一题",
										isShow: true
									});
									if (value == question[i].answer) {
										this.setState({
											showColor: Colors.weixin
										});
									} else {
										this.setState({
											showColor: Colors.red
										});
									}
								} else {
									this.nextQuestion();
								}
							}}
							style={{ height: 38 }}
							theme={Colors.blue}
							fontSize={14}
						/>
					</View>
					<TouchableOpacity style={{ alignItems: "flex-end", paddingTop: 15 }}>
						<Text style={{ color: Colors.grey, fontSize: 13 }}>搜一搜答案</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={{ marginBottom: 35, alignItems: "center" }}>
					<Text style={{ color: Colors.grey }}>点击生成二维码分享</Text>
				</TouchableOpacity>
				<CorrectModal
					visible={isShow}
					handleVisible={this.handleCorrectModal.bind(this)}
					title={value == question[i].answer}
					nextQuestion={this.nextQuestion.bind(this)}
				/>
			</Screen>
		);
	}

	nextQuestion() {
		const { i, isShow } = this.state;
		this.setState({
			i: i + 1,
			isMethod: null,
			value: null,
			showColor: Colors.theme,
			name: "提交答案"
			// isShow: !isShow
		});
		this.handleCorrectModal();
	}

	handleCorrectModal() {
		this.setState(prevState => ({
			isShow: !prevState.isShow
		}));
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
		user: store.users.user
	};
})(AnswerScreen);
