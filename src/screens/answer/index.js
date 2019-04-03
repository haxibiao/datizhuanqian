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
	StatusView
} from '../../components';

import { Theme, PxFit, SCREEN_WIDTH, Tools } from '../../utils';

import QuestionError from './components/QuestionError';
import QuestionOptions from './components/QuestionOptions';
import QuestionBody from './components/QuestionBody';
import UserInfo from './components/UserInfo';
import FiexdFooter from './components/FiexdFooter';
import FooterBar from './components/FooterBar';
import CommentOverlay from './components/CommentOverlay';
import AnswerPlaceholder from './components/AnswerPlaceholder';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { QuestionsQuery, QuestionQuery, QuestionAnswerMutation } from '../../assets/graphql/question.graphql';
import { UserQuery } from '../../assets/graphql/user.graphql';
import { Query, compose, graphql, withApollo } from 'react-apollo';

class index extends Component {
	constructor(props) {
		super(props);
		this.firstLoad = true;
		this.questions = null;
		// 题目长度，用与加载更多的offset
		this.questionsLength = 0;
		this.state = {
			question: null,
			submited: false,
			answer: null,
			showComment: false
		};
	}

	componentWillReceiveProps(nextProps) {
		// 初始化 首次加载
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
					answer: answer.join('')
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
		// 剩余5条数据加载就更多题目
		if (this.questions.length <= 5) {
			this.onLoadMore();
		}
	};

	// 加载更多
	onLoadMore = () => {
		let { fetchMore } = this.props.data;
		fetchMore({
			variables: {
				offset: this.questionsLength
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!(fetchMoreResult && fetchMoreResult.questions && fetchMoreResult.questions.length > 0)) {
					return prev;
				}
				console.log('fetchMoreResult.questions', fetchMoreResult.questions);
				this.questionsLength += fetchMoreResult.questions.length;
				this.questions = [...this.questions, ...fetchMoreResult.questions];
				return Object.assign({}, prev, {
					questions: fetchMoreResult.questions
				});
			}
		});
	};

	showComment = () => {
		if (!this.state.submited) {
			Toast.show({ content: '先答题再评论哦', layout: 'bottom' });
		} else {
			this.setState({ showComment: true });
		}
	};

	hideComment = () => {
		this.setState({ showComment: false });
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
		let { answer, submited, question, showComment } = this.state;
		const { navigation, user, noTicketTips, data } = this.props;
		const { category } = navigation.state.params;
		if (data.error) {
			return <QuestionError />;
		}
		if (!question && !this.firstLoad) {
			return (
				<StatusView.EmptyView
					titleStyle={{ textAlign: 'center', fontSize: PxFit(13), lineHeight: PxFit(18) }}
					title={`您已经答完了${category.name}的题目,真是太厉害啦！\n去其它分类下继续答题吧~`}
				/>
			);
		} else if (!question) {
			return <AnswerPlaceholder />;
		}
		return (
			<React.Fragment>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="always"
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
					showComment={this.showComment}
					oSubmit={this.onSubmit}
				/>
				<CommentOverlay
					visible={showComment}
					onHide={this.hideComment}
					questionId={question.id}
					comments={question.comments}
				/>
			</React.Fragment>
		);
	};

	render() {
		return (
			<PageContainer title="答题" autoKeyboardInsets={false} onWillBlur={this.hideComment}>
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
			return {
				variables: { category_id: props.navigation.getParam('category', {}).id, limit: 10, comment_limit: 10 },
				fetchPolicy: 'network-only'
			};
		}
	}),
	connect(store => ({
		user: store.users.user,
		noTicketTips: store.users.noTicketTips
	}))
)(index);
