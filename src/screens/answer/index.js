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
	Placeholder,
	StatusView
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

import { QuestionsQuery, QuestionAnswerMutation } from '../../assets/graphql/question.graphql';
import { UserQuery } from '../../assets/graphql/user.graphql';
import { Query, compose, graphql, withApollo } from 'react-apollo';

class index extends Component {
	constructor(props) {
		super(props);
		this.firstLoad = true;
		this.questions = null;
		this.questionsLength = 0;
		this.state = {
			question: null,
			submited: false,
			answer: null
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.firstLoad) {
			let questions = Tools.syncGetter('questions', nextProps.data);
			console.log('questions', questions);
			if (questions) {
				this.firstLoad = false;
				this.questions = questions;
				this.questionsLength = questions.length;
				this.setState({ question: this.questions.shift() });
			}
		}
	}

	//提交答案 下一题
	onSubmit = () => {
		if (!this.state.submited) {
			//下一题
			this.submitAnswer();
		} else {
			//提交答案
			this.nextQuestion();
		}
	};

	async submitAnswer() {
		let { answer, question } = this.state;
		let result = {};
		this.setState({
			submited: true
		});
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
						variables: { id: this.props.user.id },
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

	nextQuestion = () => {
		this.setState({
			question: this.questions.shift(),
			submited: false,
			answer: null
		});
		if (this.questions.length === 5) {
			this.onLoadMore();
		}
	};

	onLoadMore = () => {
		let { fetchMore } = this.props.data;
		console.log('this.questionsLength', this.questionsLength);
		fetchMore({
			variables: {
				offset: this.questionsLength
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!(fetchMoreResult && fetchMoreResult.questions && fetchMoreResult.questions.length > 0)) {
					return prev;
				}
				this.questionsLength += fetchMoreResult.questions.length;
				this.questions = [...this.questions, ...fetchMoreResult.questions];
				return Object.assign({}, prev, {
					questions: fetchMoreResult.questions
				});
			}
		});
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

	renderContent = () => {
		let { answer, submited, question } = this.state;
		const { navigation, user, noTicketTips, data } = this.props;
		const { category } = navigation.state.params;
		if (data.error) {
			return <QuestionError />;
		}
		if (data.loading) return <Placeholder />;
		if (!question && !this.firstLoad)
			return (
				<StatusView.EmptyView
					titleStyle={{ textAlign: 'center', fontSize: PxFit(13), lineHeight: PxFit(18) }}
					title={`您已经答完了${category.name}的题目,真是太厉害啦！\n去其它分类下继续答题吧~`}
				/>
			);
		return (
			<React.Fragment>
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
								<Text style={styles.answerText}>正确答案: {[...question.answer].join(',')}</Text>
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
					oSubmit={this.onSubmit}
				/>
			</React.Fragment>
		);
	};

	render() {
		return (
			<PageContainer title="答题">
				<View style={styles.container}>{this.renderContent()}</View>
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

export default compose(
	withApollo,
	graphql(QuestionAnswerMutation, { name: 'QuestionAnswerMutation' }),
	graphql(QuestionsQuery, {
		options: props => {
			const category = props.navigation.getParam('category', {});
			return { variables: { category_id: category.id, limit: 10 }, fetchPolicy: 'network-only' };
		}
	}),
	connect(store => ({
		user: store.users.user,
		noTicketTips: store.users.noTicketTips
	}))
)(index);
