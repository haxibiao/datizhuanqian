/*
 * @flow
 * created by wyk made in 2019-03-19 11:22:26
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import {
	PageContainer,
	TouchFeedback,
	Iconfont,
	ItemSeparator,
	PopOverlay,
	SubmitLoading,
	Row,
	Button,
	TabBar,
	Placeholder
} from '../../components';

import { Theme, PxFit, SCREEN_WIDTH, Tools } from '../../utils';

import QuestionError from './components/QuestionError';
import QuestionOptions from './components/QuestionOptions';
import QuestionBody from './components/QuestionBody';
import UserInfo from './components/UserInfo';
import FiexdFooter from './components/FiexdFooter';
import FooterBar from './components/FooterBar';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { QuestionQuery, QuestionAnswerMutation } from '../../assets/graphql/question.graphql';
import { UserQuery } from '../../assets/graphql/user.graphql';
import { Query, compose, graphql, withApollo } from 'react-apollo';

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submited: false,
			answer: null
		};
	}
	//提交答案 下一题
	onSubmit = (question, refetch) => {
		return async () => {
			const { user } = this.props;
			let { submited, answer } = this.state;
			let result = {};
			if (submited) {
				//下一题
				this.nextQuestion(refetch);
			} else {
				//提交答案
				this.setState({
					submited: true
				});
				//UI状态改变
				try {
					result = await this.props.QuestionAnswerMutation({
						variables: {
							id: question.id,
							answer: answer.join()
						},
						errorPolicy: 'all',
						refetchQueries: () => [
							{
								query: UserQuery,
								variables: { id: user.id },
								fetchPolicy: 'network-only'
							}
						]
					});
				} catch (ex) {
					result.errors = ex;
				}
				if (result && result.errors) {
					let str = result.errors[0].message;
					Toast.show({ content: str });
				}
			}
		};
	};

	nextQuestion = refetch => {
		const { category } = this.props.navigation.state.params;
		this.setState({
			submited: false,
			answer: null
		});
		//重置state
		refetch({ category_id: category.id });
		//更换题目
	};

	onComment = () => {
		if (!this.state.submited) {
			Toast.show({ content: '先答题再评论哦', layout: 'bottom' });
		}
	};

	//选择的选项
	//单选/多选：单选会清除其它已选择的选项
	selectOption = (value, singleOption) => {
		let { answer } = this.state;
		if (!answer) answer = [];
		if (singleOption) {
			if (answer.includes(value)) {
				answer = null;
			} else {
				answer = [value];
			}
		} else {
			if (answer.includes(value)) {
				answer.splice(answer.indexOf(value), 1);
				if (answer.length < 1) {
					answer = null;
				}
			} else {
				answer.push(value);
			}
		}
		this.setState({ answer });
	};

	render() {
		const { navigation, user, noTicketTips } = this.props;
		let { answer, submited } = this.state;
		const { category, question_id } = navigation.state.params;

		return (
			<PageContainer title="答题">
				<Query
					query={QuestionQuery}
					variables={{ category_id: category ? category.id : null, id: question_id }}
					fetchPolicy="network-only"
				>
					{({ data, error, loading, refetch, fetchMore }) => {
						let question = Tools.syncGetter('question', data);
						loading = !question;
						if (error) {
							return <QuestionError />;
						}
						if (loading) return <Placeholder />;
						return (
							<View style={styles.container}>
								<ScrollView
									contentContainerStyle={{ flexGrow: 1 }}
									showsVerticalScrollIndicator={false}
									bounces={false}
								>
									<TabBar />
									<View style={styles.content}>
										<UserInfo user={question.user} navigation={navigation} />
										<QuestionBody question={question} />
										<QuestionOptions
											selections={question.selections_array}
											onSelectOption={this.selectOption}
											submited={submited}
											answer={question.answer}
											selectedOption={answer}
										/>
									</View>
									{submited && (
										<View style={styles.tipsView}>
											<View>
												<Text style={styles.answerText}>
													正确答案: {[...question.answer].join(',')}
												</Text>
											</View>
											<Row>
												<Text style={styles.curationText}>答案有误?</Text>
												<Text
													style={styles.errorText}
													onPress={() => navigation.navigate('Curation', { question })}
												>
													帮忙纠错
												</Text>
											</Row>
										</View>
									)}
								</ScrollView>
								<FooterBar
									navigation={navigation}
									question={question}
									submited={submited}
									answer={answer}
									onComment={this.onComment}
									oSubmit={this.onSubmit(question, refetch)}
								/>
							</View>
						);
					}}
				</Query>
			</PageContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	content: {
		paddingTop: PxFit(20),
		paddingHorizontal: PxFit(Theme.itemSpace)
	},
	submitWrap: {
		marginTop: PxFit(50),
		marginBottom: PxFit(30)
	},
	tipsView: {
		margin: PxFit(Theme.itemSpace),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: PxFit(Theme.itemSpace)
	},
	answerText: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor
	},
	curationText: {
		fontSize: PxFit(13),
		color: Theme.subTextColor
	},
	errorText: {
		fontSize: PxFit(13),
		paddingLeft: PxFit(5),
		color: Theme.errorColor
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		noTicketTips: store.users.noTicketTips
	};
})(compose(graphql(QuestionAnswerMutation, { name: 'QuestionAnswerMutation' }))(withApollo(index)));
