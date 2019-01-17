import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Animated, Dimensions, ScrollView } from 'react-native';

import {
	DivisionLine,
	TabTop,
	LoadingError,
	BlankContent,
	Loading,
	Banner,
	ErrorBoundary
} from '../../components/Universal';
import { Button } from '../../components/Control';
import { CorrectModal } from '../../components/Modal';
import { Colors } from '../../constants';
import { Iconfont } from '../../utils/Fonts';

import Screen from '../Screen';
import Question from './Question';
import { connect } from 'react-redux';
import actions from '../../store/actions';

import { QuestionQuery, QuestionAnswerMutation } from '../../graphql/question.graphql';
import { UserQuery } from '../../graphql/user.graphql';
import { Query, Mutation } from 'react-apollo';

const { width, height } = Dimensions.get('window');

class AnswerScreen extends Component {
	constructor(props) {
		super(props);
		// this.nextQuestion = this.nextQuestion.bind(this);
		this.changeValue = this.changeValue.bind(this);
		this.state = {
			i: 0,
			isMethod: false,
			value: null,
			isShow: false,
			showColor: Colors.theme,
			name: '提交答案',
			buttonColor: Colors.blue,
			rightColor: Colors.tintGray
		};
	}
	render() {
		const { navigation, prop, user, noTicketTips } = this.props;
		const { i, value, isMethod, isShow, showColor, name, buttonColor, rightColor } = this.state;
		const { category } = navigation.state.params;
		console.log('userrend', user);
		return (
			<Screen
				routeName={'答题'}
				customStyle={{ backgroundColor: Colors.theme, borderBottomWidth: 0 }}
				// rightComponent={<Iconfont name={"more-vertical"} size={18} color={Colors.primaryFont} />}  隐藏功能
			>
				<Query query={QuestionQuery} variables={{ category_id: category.id }} fetchPolicy="network-only">
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <Loading />;
						if (!(data && data.question))
							return (
								<BlankContent
									children={
										<View>
											<Text style={{ fontSize: 15, color: Colors.tintFont, marginTop: 12 }}>
												{category.name}的题目已经答完了哦
											</Text>
											<Text
												style={{
													fontSize: 15,
													color: Colors.tintFont,
													marginTop: 12,
													textAlign: 'center'
												}}
											>
												快去其他分类继续答题赚钱吧~
											</Text>
										</View>
									}
								/>
							);
						let question = data.question;
						let selections = data.question.selections.replace(/\\/g, '');
						let option = null;
						try {
							option = JSON.parse(selections);
						} catch (error) {
							<LoadingError reload={() => refetch()} />;
						}

						return (
							<ErrorBoundary>
								<ScrollView style={styles.container}>
									<View>
										<TabTop user={user} isShow={isShow} isAnswer={true} />
										<Banner />
										<View style={styles.content}>
											<ErrorBoundary reload={() => refetch()}>
												<Question
													question={question}
													option={option}
													changeValue={this.changeValue}
													value={value}
													isMethod={isMethod}
													showColor={showColor}
													rightColor={rightColor}
												/>
											</ErrorBoundary>
											{
												//因为题目库 选择项中产生了很多脏数据,所以对渲染做异常处理,防止release版本不会crash
											}
											<View style={styles.submit}>
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
																			name: '下一题',
																			isShow: true,
																			buttonColor:
																				question.answer.indexOf(value) > -1
																					? Colors.weixin
																					: Colors.themeRed,
																			rightColor: Colors.weixin
																		});
																		answerQuestion({
																			variables: {
																				id: question.id,
																				answer: value
																			},
																			refetchQueries: () => [
																				{
																					query: UserQuery,
																					variables: { id: user.id }
																				}
																			]
																		});

																		if (question.answer.indexOf(value) > -1) {
																			this.setState({
																				showColor: Colors.weixin
																			});
																			// this.props.dispatch(
																			// 	actions.updateGold(
																			// 		user.gold + question.gold
																			// 	)
																			// );
																		} else {
																			this.setState({
																				showColor: Colors.themeRed
																			});
																		}
																	} else {
																		this.setState({
																			isMethod: null,
																			value: null,
																			showColor: Colors.theme,
																			name: '提交答案',
																			buttonColor: Colors.blue,
																			rightColor: Colors.tintGray
																			// isShow: !isShow
																		});
																		refetch({ category_id: category.id });
																	}
																}}
																style={{ height: 38 }}
																theme={buttonColor}
																fontSize={14}
																disabledColor={'rgba(64,127,207,0.7)'}
															/>
														);
													}}
												</Mutation>

												{
													// <TouchableOpacity
													// 	style={{ alignItems: "flex-end", paddingTop: 15 }}
													// 	onPress={() =>
													// 		navigation.navigate("题目纠错", { id: question.id })
													// 	}
													// >
													// 	<Text
													// 		style={{
													// 			color: Colors.orange,
													// 			fontSize: 12,
													// 			fontWeight: "200"
													// 		}}
													// 	>
													// 		题目纠错
													// 	</Text>
													// </TouchableOpacity>
													//隐藏功能
												}
											</View>
										</View>
									</View>
									{
										// <TouchableOpacity
										// 	style={{
										// 		alignItems: "center",
										// 		flex: 1
										// 	}}
										// >
										// 	<Text style={{ color: Colors.grey }}>点击生成二维码分享</Text>
										// </TouchableOpacity>
									}
									<Query query={UserQuery} variables={{ id: user.id }}>
										{({ data, loading, error, refetch }) => {
											if (error) return null;
											if (!(data && data.user)) return null;
											let user = data.user;
											return (
												<CorrectModal
													visible={isShow}
													gold={question.gold}
													user={data.user}
													noTicketTips={noTicketTips}
													handleVisible={this.handleCorrectModal.bind(this)}
													CloseModal={this.CloseModal.bind(this)}
													title={question.answer.indexOf(value) > -1}
													answer={question.answer}
													// nextQuestion={() => {
													// 	this.nextQuestion();
													// 	refetch({ category_id: category.id });
													// }}
												/>
											);
										}}
									</Query>
								</ScrollView>
							</ErrorBoundary>
						);
					}}
				</Query>
			</Screen>
		);
	}

	// nextQuestion() {
	// 	this.setState({
	// 		isMethod: null,
	// 		value: null,
	// 		showColor: Colors.theme,
	// 		name: '提交答案'
	// 	});
	// 	this.handleCorrectModal();
	// }

	handleCorrectModal() {
		this.setState(prevState => ({
			isShow: !prevState.isShow
		}));
	}

	CloseModal() {
		let { isShow } = this.state;

		this.timer = setTimeout(() => {
			this.setState(prevState => ({
				isShow: false
			}));
		}, 800);
		if (!isShow) {
			clearTimeout(this.timer);
		}
	}

	changeValue(Value) {
		this.setState({
			value: Value
		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
		// justifyContent: "space-between"
	},
	content: {
		paddingTop: 30,

		paddingHorizontal: 30
	},
	options: {
		paddingTop: 30,
		paddingHorizontal: 10
	},
	submit: {
		marginTop: 50,
		marginBottom: 30
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
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 12
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		noTicketTips: store.users.noTicketTips
	};
})(AnswerScreen);