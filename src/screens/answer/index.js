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
	Button,
	TabBar
} from '../../components';

import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT } from '../../utils';

import QuestionError from './components/QuestionError';
import QuestionOption from './components/QuestionOption';
import QuestionBody from './components/QuestionBody';
import FavoriteQuestion from './components/FavoriteQuestion';
import UserInfo from './components/UserInfo';
import FiexdFooter from './components/FiexdFooter';

import { connect } from 'react-redux';
import actions from '../../store/actions';

import { QuestionQuery, QuestionAnswerMutation } from '../../assets/graphql/question.graphql';
import { UserQuery } from '../../assets/graphql/user.graphql';
import { Query, compose, graphql, withApollo } from 'react-apollo';

class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			swithMethod: false,
			value: '',
			isShow: false,
			name: '提交答案',
			optionColor: Theme.theme, //选项颜色
			buttonColor: Theme.theme, //按钮颜色
			rightColor: Theme.tintGray //正确答案颜色,
		};
	}

	//提交答案 下一题
	submitAnswer = async (question, refetch) => {
		const { user } = this.props;
		let { swithMethod, name, isShow, optionColor, buttonColor, rightColor, value } = this.state;
		let result = {};

		if (swithMethod) {
			//下一题
			this.nextQuestion(refetch);
		} else {
			//提交答案
			this.setState({
				swithMethod: true,
				name: '下一题',
				isShow: true,
				buttonColor: question.answer.indexOf(value) > -1 ? Theme.weixin : Theme.themeRed,
				optionColor: question.answer.indexOf(value) > -1 ? Theme.weixin : Theme.themeRed,
				rightColor: Theme.weixin
			});
			//UI状态改变
			try {
				result = await this.props.QuestionAnswerMutation({
					variables: {
						id: question.id,
						answer: value
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
				Methods.toast(str, -100);
			}
		}
	};

	nextQuestion = refetch => {
		const { category } = this.props.navigation.state.params;
		this.favoriteButton.resetFavorite();
		this.setState({
			swithMethod: false,
			value: '',
			name: '提交答案',
			optionColor: Theme.theme,
			buttonColor: Theme.blue,
			rightColor: Theme.tintGray
		});
		//重置state
		refetch({ category_id: category.id });
		//更换题目
	};

	changeValue(Value) {
		this.setState({
			value: Value
		});
	}

	getQuestionId = () => {
		return this.questionId;
	};

	_showCuration = () => {
		let { swithMethod } = this.state;
		const { question, navigation } = this.props;
		return (
			<TouchFeedback
				style={styles.curation}
				onPress={() => navigation.navigate('题目纠错', { question: question })}
			>
				<Text style={styles.curationText}>{swithMethod ? '题目纠错' : ''}</Text>
			</TouchFeedback>
		);
	};

	render() {
		const { navigation, user, noTicketTips } = this.props;
		let { value, swithMethod, isShow, optionColor, name, buttonColor, rightColor } = this.state;
		const { category, question_id } = navigation.state.params;

		return (
			<PageContainer
				title="答题"
				rightView={
					<FavoriteQuestion ref={ref => (this.favoriteButton = ref)} getQuestionId={this.getQuestionId} />
				}
			>
				<Query
					query={QuestionQuery}
					variables={{ category_id: category ? category.id : null, id: question_id }}
					fetchPolicy="network-only"
				>
					{({ data, error, loading, refetch, fetchMore }) => {
						if (error) {
							return <QuestionError />;
						}
						if (loading) return null;
						if (!(data && data.question)) return null;

						let question = data.question;
						this.questionId = question.id;

						let selections = data.question.selections.replace(/\\/g, '');
						let option = [];
						try {
							option = JSON.parse(selections);
						} catch (error) {
							<LoadingError reload={() => refetch()} />;
						}

						return (
							<View style={{ flex: 1, minheight: SCREEN_HEIGHT }}>
								<ScrollView style={styles.container}>
									{/*<TabTop user={user} isShow={isShow} isAnswer={true} />*/}
									<TabBar />
									<View style={styles.content}>
										<UserInfo user={question.user} />
										<QuestionBody question={question} />
										<QuestionOption
											question={question}
											option={option}
											changeValue={this.changeValue.bind(this)}
											value={value}
											swithMethod={swithMethod}
											optionColor={optionColor}
											rightColor={rightColor}
										/>
										<View style={styles.submitWrap}>
											{this._showCuration(question)}
											<Button
												title={name}
												disabled={value ? false : true}
												onPress={() => {
													this.submitAnswer(question, refetch);
												}}
												style={{ height: 38, backgroundColor: buttonColor }}
												fontSize={14}
											/>
										</View>
									</View>
								</ScrollView>
								<FiexdFooter question={question.id} />
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
		backgroundColor: Theme.white
	},

	content: {
		paddingTop: 20,
		paddingHorizontal: 30
	},
	submitWrap: {
		marginTop: 50,
		marginBottom: 30
	},
	curation: {
		alignItems: 'flex-end',
		paddingBottom: 15
	},
	curationText: {
		color: Theme.orange,
		fontSize: 12,
		fontWeight: '200'
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		noTicketTips: store.users.noTicketTips
	};
})(compose(graphql(QuestionAnswerMutation, { name: 'QuestionAnswerMutation' }))(withApollo(index)));
