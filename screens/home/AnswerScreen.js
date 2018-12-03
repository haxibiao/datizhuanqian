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

import { QuestionQuery, QuestionAnswerMutation } from "../../graphql/question.graphql";
import { UserQuery } from "../../graphql/user.graphql";
import { Query, Mutation } from "react-apollo";

class AnswerScreen extends Component {
	constructor(props) {
		super(props);
		this.nextQuestion = this.nextQuestion.bind(this);
		this.state = {
			i: 0,
			isMethod: false,
			value: null,
			isShow: false,
			showColor: Colors.theme,
			name: "提交答案"
		};
	}
	render() {
		const { navigation, prop, user } = this.props;
		const { i, value, isMethod, isShow, showColor, name } = this.state;
		const { plate_id } = navigation.state.params;
		console.log("plate", plate_id);
		return (
			<Screen routeName={"答题"} customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}>
				<Query query={QuestionQuery} variables={{ category_id: plate_id }}>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return null;
						if (!(data && data.question)) return null;
						let question = data.question;
						let selections = data.question.selections.replace(/\\/g, "");
						let option = JSON.parse(selections);
						console.log("option", option);
						return (
							<View style={styles.container}>
								<View>
									<TabTop user={user} isShow={isShow} isAnswer={true} />
									<View style={{ marginTop: 30, paddingHorizontal: 30 }}>
										<Text style={styles.title}>{question.description}</Text>
										<View style={{ paddingTop: 30, paddingHorizontal: 10 }}>
											<TouchableOpacity
												disabled={isMethod}
												style={[
													styles.option,
													{
														borderColor: value == "A" ? showColor : Colors.tintGray
													}
												]}
												onPress={() => {
													this.setState({
														value: "A"
													});
												}}
											>
												<Text>{option.Selection[0].Text}</Text>
											</TouchableOpacity>
											<TouchableOpacity
												disabled={isMethod}
												style={[
													styles.option,
													{
														borderColor: value == "B" ? showColor : Colors.tintGray
													}
												]}
												onPress={() => {
													this.setState({
														value: "B"
													});
												}}
											>
												<Text>{option.Selection[1].Text}</Text>
											</TouchableOpacity>
											<TouchableOpacity
												disabled={isMethod}
												style={[
													styles.option,
													{
														borderColor: value == "C" ? showColor : Colors.tintGray
													}
												]}
												onPress={() => {
													this.setState({
														value: "C"
													});
												}}
											>
												<Text>{option.Selection[2].Text}</Text>
											</TouchableOpacity>
											<TouchableOpacity
												disabled={isMethod}
												style={[
													styles.option,
													{
														borderColor: value == "D" ? showColor : Colors.tintGray
													}
												]}
												onPress={() => {
													this.setState({
														value: "D"
													});
												}}
											>
												<Text>{option.Selection[3].Text}</Text>
											</TouchableOpacity>
										</View>
										<View style={{ height: 82, marginTop: 50 }}>
											{isShow ? (
												<View style={styles.tips}>
													<Text
														style={
															question.answer == this.state.value
																? { color: Colors.weixin }
																: { color: "#ff0000" }
														}
													>
														{question.answer == this.state.value ? "回答正确" : "回答错误"}
													</Text>
												</View>
											) : (
												<Text />
											)}
											<Mutation mutation={QuestionAnswerMutation}>
												{answerQuestion => {
													return (
														<Button
															name={name}
															disabled={value ? false : true}
															handler={async () => {
																if (!isMethod) {
																	this.setState({
																		isMethod: true,
																		name: "下一题",
																		isShow: true
																	});
																	let result = {};
																	result = await answerQuestion({
																		variables: {
																			id: question.id,
																			answer: question.answer
																		},
																		refetchQueries: answerQuestion => [
																			{
																				query: UserQuery,
																				variables: { id: user.id }
																			}
																		]
																	});
																	console.log("result", result);
																	if (value == question.answer) {
																		this.setState({
																			showColor: Colors.weixin
																		});
																		// this.props.dispatch(actions.updateCounts(counts));
																	} else {
																		this.setState({
																			showColor: Colors.red
																		});
																	}
																} else {
																	this.setState({
																		isMethod: null,
																		value: null,
																		showColor: Colors.theme,
																		name: "提交答案"
																		// isShow: !isShow
																	});
																	refetch({ category_id: plate_id });
																}
															}}
															style={{ height: 38 }}
															theme={Colors.blue}
															fontSize={14}
														/>
													);
												}}
											</Mutation>
											<TouchableOpacity
												style={{ alignItems: "flex-end", marginTop: 15 }}
												onPress={() => refetch({ category_id: plate_id })}
											>
												<Text
													style={{ color: Colors.tintFont, fontSize: 12, fontWeight: "200" }}
												>
													搜一搜答案
												</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>

								<CorrectModal
									visible={isShow}
									gold={question.gold}
									handleVisible={this.handleCorrectModal.bind(this)}
									title={value == question.answer}
									nextQuestion={() => {
										this.nextQuestion();
										refetch({ category_id: plate_id });
									}}
								/>
								<TouchableOpacity style={{ marginBottom: 35, alignItems: "center" }}>
									<Text style={{ color: Colors.grey }}>点击生成二维码分享</Text>
								</TouchableOpacity>
							</View>
						);
					}}
				</Query>
			</Screen>
		);
	}

	nextQuestion() {
		this.setState({
			isMethod: null,
			value: null,
			showColor: Colors.theme,
			name: "提交答案"
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
		justifyContent: "space-between"
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
		paddingVertical: 12
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
