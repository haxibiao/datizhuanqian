import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, Animated, Dimensions } from "react-native";

import { DivisionLine, TabTop, LoadingError, BlankContent, Loading, Banner } from "../../components/Universal";
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

const { width, height } = Dimensions.get("window");

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
		console.log("value", value);
		return (
			<Screen routeName={"答题"} customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}>
				<TabTop user={user} isShow={isShow} isAnswer={true} />
				<Banner />
				<Query query={QuestionQuery} variables={{ category_id: plate_id }}>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} text={"题目列表加载失败"} />;
						if (loading) return <Loading />;
						if (!(data && data.question)) return <BlankContent />;
						let question = data.question;
						let selections = data.question.selections.replace(/\\/g, "");
						let option = JSON.parse(selections);
						console.log("option", option);
						return (
							<View style={styles.container}>
								<View>
									<View style={{ marginTop: 30, paddingHorizontal: 30 }}>
										<Text style={styles.title}>{question.description}</Text>
										{question.image && (
											<Image
												source={{
													uri:
														"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1543911882126&di=ca5f066d93d61441c606ecd368a2ec4e&imgtype=0&src=http%3A%2F%2Fs15.sinaimg.cn%2Fmw690%2Fc329e16ftd7a1472b885e%26690"
												}}
												style={{ width: width - 60, height: 60, marginTop: 10 }}
											/>
										)
										//需要返回图片的宽高
										}
										<View style={{ paddingTop: 30, paddingHorizontal: 10 }}>
											{option.Selection.map((option, index) => {
												return (
													<TouchableOpacity
														disabled={isMethod}
														key={index}
														style={[
															styles.option,
															{
																borderColor:
																	value == option.Value ? showColor : Colors.tintGray
															}
														]}
														onPress={() => {
															this.setState({
																value: option.Value
															});
														}}
													>
														<Text>{option.Text}</Text>
													</TouchableOpacity>
												);
											})}
										</View>
										<View style={{ height: 82, marginTop: 50 }}>
											<Mutation mutation={QuestionAnswerMutation}>
												{answerQuestion => {
													return (
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
																	answerQuestion({
																		variables: {
																			id: question.id,
																			answer: value
																		},
																		refetchQueries: answerQuestion => [
																			{
																				query: UserQuery,
																				variables: { id: user.id }
																			}
																		]
																	});
																	if (value == question.answer) {
																		this.setState({
																			showColor: Colors.weixin
																		});
																		this.props.dispatch(
																			actions.updateGold(
																				user.gold + question.gold
																			)
																		);
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
		fontSize: 16,
		lineHeight: 22
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
