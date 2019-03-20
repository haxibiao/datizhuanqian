import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';

import {
	TabTop,
	LoadingError,
	BlankContent,
	Loading,
	Banner,
	ErrorBoundary,
	Button,
	CorrectModal,
	Screen,
	Iconfont,
	Avatar
} from '../../components';

import { Colors, Divice } from '../../constants';
import { Methods } from '../../helpers';

import Question from './Question';
import { connect } from 'react-redux';
import actions from '../../store/actions';

import { QuestionQuery, QuestionAnswerMutation, toggleFavoriteMutation } from '../../graphql/question.graphql';
import { UserQuery } from '../../graphql/user.graphql';
import { Query, Mutation, compose, graphql, withApollo } from 'react-apollo';

class FavoriteQuestion extends Component {
	constructor(props) {
		super(props);

		this.state = {
			favorite: false
		};
	}

	favoriteQuestion = toggleFavorite => {
		this.setState({ favorite: !this.state.favorite });
		toggleFavorite({ variables: { data: { favorable_id: this.props.getQuestionId() } } });
	};

	onFavoriteCompleted = () => {
		Methods.toast(this.state.favorite ? '收藏成功' : '取消收藏', 200);
	};

	onFavoriteError = err => {
		this.setState({ favorite: !this.state.favorite });
		let str = err.toString().replace(/Error: GraphQL error: /, '');
		Methods.toast(str, -100);
	};

	resetFavorite = () => {
		this.setState({ favorite: false });
	};

	render() {
		let { onCompleted, onError } = this.props;
		return (
			<Mutation
				mutation={toggleFavoriteMutation}
				onCompleted={this.onFavoriteCompleted}
				onError={this.onFavoriteError}
			>
				{toggleFavorite => {
					return (
						<TouchableOpacity onPress={() => this.favoriteQuestion(toggleFavorite)}>
							<Iconfont
								name={this.state.favorite ? 'collection-fill' : 'collection'}
								color="#262626"
								size={22}
							/>
						</TouchableOpacity>
					);
				}}
			</Mutation>
		);
	}
}

class AnswerScreen extends Component {
	constructor(props) {
		super(props);
		this.changeValue = this.changeValue.bind(this);
		this.submitAnswer = this.submitAnswer.bind(this);
		this.state = {
			isMethod: false,
			value: '',
			isShow: false,
			name: '提交答案',
			pickColor: Colors.theme, //选中的颜色
			buttonColor: Colors.blue, //按钮颜色
			rightColor: Colors.tintGray //正确答案颜色,
		};
	}

	//提交答案 下一题
	async submitAnswer(question, refetch) {
		const { user, navigation } = this.props;
		let { value, isMethod, isShow, pickColor, name, buttonColor, rightColor } = this.state;
		let result = {};

		if (!isMethod) {
			//提交答案
			this.setState({
				isMethod: true,
				name: '下一题',
				isShow: true,
				buttonColor: question.answer.indexOf(value) > -1 ? Colors.weixin : Colors.themeRed,
				pickColor: question.answer.indexOf(value) > -1 ? Colors.weixin : Colors.themeRed,
				rightColor: Colors.weixin
			});
			//UI状态改变
			try {
				result = await this.props.QuestionAnswerMutation({
					variables: {
						id: question.id,
						answer: value
					},
					refetchQueries: () => [
						{
							query: UserQuery,
							variables: { id: user.id },
							fetchPolicy: 'network-only'
						}
					],
					update: (cache, result) => {
						console.log('强制全局更新这个query的缓存');
						//强制全局更新这个query的缓存
						this.props.client.query({
							query: UserQuery,
							variables: { id: user.id },
							fetchPolicy: 'network-only'
						});
					}
				});
			} catch (ex) {
				result.errors = ex;
			}
			//发起请求
			if (result && result.errors) {
				let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
				Methods.toast(str, -100);
			}
		} else {
			//下一题
			this.nextQuestion(refetch);
		}
	}

	nextQuestion = refetch => {
		const { category } = this.props.navigation.state.params;
		this.favoriteButton.resetFavorite();
		this.setState({
			isMethod: false,
			value: '',
			name: '提交答案',
			pickColor: Colors.theme,
			buttonColor: Colors.blue,
			rightColor: Colors.tintGray
		});
		refetch({ category_id: category.id });
	};

	getQuestionId = () => {
		return this.questionId;
	};

	render() {
		const { navigation, user, noTicketTips } = this.props;
		let { value, isMethod, isShow, pickColor, name, buttonColor, rightColor } = this.state;
		const { category, question_id } = navigation.state.params;

		console.log('navigation.state.params', navigation.state.params);
		return (
			<Screen
				routeName={category.name}
				customStyle={{
					backgroundColor: isShow ? '#977018' : Colors.theme,
					borderBottomWidth: 0,
					borderBottomColor: 'transparent'
				}}
				headerRight={
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
							let info = error.toString().indexOf('维护');
							if (info > -1) {
								//维护处理
								return (
									<View
										style={{
											flex: 1,
											justifyContent: 'center',
											alignItems: 'center',
											width: Divice.width - 30
										}}
									>
										<Text style={{ textAlign: 'center' }}>
											{error.toString().replace(/Error: GraphQL error: /, '')}
										</Text>
									</View>
								);
							}
							return <LoadingError reload={() => refetch()} />;
						}
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
						this.questionId = question.id;
						//转义 防止后端数据错误
						let selections = data.question.selections.replace(/\\/g, '');
						let option = '';
						try {
							option = JSON.parse(selections);
						} catch (error) {
							<LoadingError reload={() => refetch()} />;
						}

						return (
							<View style={{ flex: 1, minheight: Divice.height }}>
								<ScrollView style={styles.container}>
									<TabTop user={user} isShow={isShow} isAnswer={true} />
									<Banner />

									<View style={styles.content}>
										<TouchableOpacity
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												paddingBottom: 15
											}}
											onPress={() =>
												navigation.navigate('用户资料', { user_id: question.user.id })
											}
										>
											<Image
												source={{ uri: question.user.avatar }}
												style={{ width: 20, height: 20, borderRadius: 3 }}
											/>
											<Text style={{ fontSize: 14, color: '#222', paddingLeft: 6 }}>
												{question.user.name}
											</Text>
										</TouchableOpacity>
										<Text style={styles.title}>{question.description}</Text>
										<ErrorBoundary reload={() => refetch()} question={question}>
											<Question
												question={question}
												option={option}
												changeValue={this.changeValue}
												value={value}
												isMethod={isMethod}
												pickColor={pickColor}
												rightColor={rightColor}
											/>
										</ErrorBoundary>
										{
											//因为题目库 选择项中产生了很多脏数据,所以对渲染做异常处理,防止release版本不会crash
										}
										<View style={[styles.submit, { marginTop: question.video ? 20 : 40 }]}>
											<TouchableOpacity
												style={styles.correction}
												disabled={!isMethod}
												onPress={() => navigation.navigate('题目纠错', { question: question })}
											>
												<Text style={styles.correctionText}>{isMethod ? '题目纠错' : ''}</Text>
											</TouchableOpacity>
											{!question_id && (
												<Button
													name={name}
													disabled={value ? false : true}
													handler={() => {
														this.submitAnswer(question, refetch);
													}}
													style={{ height: 38 }}
													theme={buttonColor}
													fontSize={14}
													disabledColor={'rgba(64,127,207,0.7)'}
												/>
											)}
										</View>
									</View>

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
												/>
											);
										}}
									</Query>
								</ScrollView>
								<View
									style={{
										backgroundColor: 'transparent',
										position: 'absolute',
										alignItems: 'center',
										bottom: 0,
										width: 40,
										left: Divice.width / 2 - 20
									}}
								>
									<Text
										style={{
											backgroundColor: 'transparent',
											color: '#CFCFCF',
											fontSize: 11,
											textAlign: 'center'
										}}
									>
										#{question.id}
									</Text>
								</View>
							</View>
						);
					}}
				</Query>
			</Screen>
		);
	}

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
	},
	title: {
		color: Colors.primaryFont,
		fontSize: 16,
		fontWeight: '400',
		fontFamily: 'Courier',
		letterSpacing: 0.5,
		lineHeight: 22
	},
	content: {
		paddingTop: 20,
		paddingHorizontal: 30
	},
	submit: {
		marginBottom: 30
	},
	correction: {
		alignItems: 'flex-end',
		paddingBottom: 10
	},
	correctionText: {
		color: Colors.orange,
		fontSize: 12,
		fontWeight: '200'
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		noTicketTips: store.users.noTicketTips
	};
})(compose(graphql(QuestionAnswerMutation, { name: 'QuestionAnswerMutation' }))(withApollo(AnswerScreen)));
