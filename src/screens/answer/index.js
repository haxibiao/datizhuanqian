/*
 * @flow
 * created by wyk made in 2019-03-19 11:22:26
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Animated } from 'react-native';
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
import AuditTitle from './components/AuditTitle';
import Audit from './components/Audit';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { QuestionsQuery, QuestionListQuery, QuestionAnswerMutation } from '../../assets/graphql/question.graphql';
import { UserQuery } from '../../assets/graphql/user.graphql';
import { Query, compose, graphql, withApollo } from 'react-apollo';

class index extends Component {
	constructor(props) {
		super(props);
		this.firstLoad = true;
		this.questions = null;
		// 题目长度，用与加载更多的offset
		this.questionsLength = 0;
		this.bodyHeight = 0;
		this.footerHeight = 0;
		this._animated = new Animated.Value(0);
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
			if (questions) {
				this.firstLoad = false;
				this.questions = questions;
				this.questionsLength = questions.length;
				this.setState({ question: this.questions.shift() });
				// 执行动画
				Animated.timing(this._animated, {
					toValue: 1,
					duration: 300
				}).start();
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
		// 执行动画
		this._animated.setValue(0);
		Animated.timing(this._animated, {
			toValue: 1,
			duration: 300
		}).start();
		// 切换题目
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
				this.questionsLength += fetchMoreResult.questions.length;
				this.questions = this.questions.concat(fetchMoreResult.questions);
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

	helpCuration = () => {
		let { question } = this.state;
		let { navigation } = this.props;
		if (question.type === 'contribute') {
			Toast.show({ content: '无法对自己出的题纠错哦~' });
		} else if (question.type === 'curation') {
			Toast.show({ content: '该题您已经纠过了呢~' });
		} else {
			navigation.navigate('Curation', { question });
		}
	};

	_onBodyLayout = e => {
		let { height } = e.nativeEvent.layout;
		this.bodyHeight = height;
	};

	_onFooterLayout = e => {
		let { height } = e.nativeEvent.layout;
		this.footerHeight = height;
	};

	renderContent = () => {
		let { answer, submited, question, showComment } = this.state;
		const {
			navigation,
			user,
			noTicketTips,
			data: { error, refetch }
		} = this.props;
		const { category } = navigation.state.params;
		if (error) {
			return <StatusView.ErrorView onPress={refetch} />;
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
		const bodyStyle = {
			opacity: this._animated,
			transform: [
				{
					translateY: this._animated.interpolate({
						inputRange: [0, 1],
						outputRange: [-this.bodyHeight, 0],
						extrapolate: 'clamp'
					})
				}
			]
		};
		const footerStyle = {
			opacity: this._animated,
			transform: [
				{
					translateY: this._animated.interpolate({
						inputRange: [0, 1],
						outputRange: [this.footerHeight, 0],
						extrapolate: 'clamp'
					})
				}
			]
		};
		// Math.random(0, 1) > 0.5 ? 0 : 1;
		question.submit = 0;
		return (
			<React.Fragment>
				<TabBar />
				<ScrollView
					contentContainerStyle={{ flexGrow: 1, paddingBottom: question.submit === 0 && SCREEN_WIDTH / 3 }}
					keyboardShouldPersistTaps="always"
					showsVerticalScrollIndicator={false}
					bounces={false}
				>
					<View style={styles.content}>
						<Animated.View style={bodyStyle} onLayout={this._onBodyLayout}>
							{question.submit === 0 ? (
								<AuditTitle navigation={navigation} />
							) : (
								<UserInfo question={question} navigation={navigation} />
							)}
							<QuestionBody question={question} />
						</Animated.View>
						<QuestionOptions
							selections={question.selections_array}
							onSelectOption={this.selectOption}
							submited={question.submit === 0 || submited}
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
								<Text style={styles.errorText} onPress={this.helpCuration}>
									帮忙纠错
								</Text>
							</Row>
						</View>
					)}
				</ScrollView>
				{question.submit === 0 ? (
					<Audit navigation={navigation} nextQuestion={this.nextQuestion} />
				) : (
					<Animated.View style={footerStyle} onLayout={this._onFooterLayout}>
						<FooterBar
							navigation={navigation}
							question={question}
							submited={submited}
							answer={answer}
							showComment={this.showComment}
							oSubmit={this.onSubmit}
						/>
					</Animated.View>
				)}
				<CommentOverlay visible={showComment} onHide={this.hideComment} questionId={question.id} />
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
		marginHorizontal: PxFit(Theme.itemSpace),
		padding: PxFit(10)
	},
	answerText: {
		fontSize: PxFit(15),
		color: Theme.defaultTextColor,
		marginBottom: PxFit(5)
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
	graphql(QuestionListQuery, {
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
