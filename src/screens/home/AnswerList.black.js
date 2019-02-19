import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, FlatList } from 'react-native';

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
	Iconfont
} from '../../components';

import { Colors, Divice } from '../../constants';
import { Methods } from '../../helpers';

import Question from './Question';
import { connect } from 'react-redux';
import actions from '../../store/actions';

import { QuestionQuery, QuestionAnswerMutation, QuestionsQuery } from '../../graphql/question.graphql';
import { UserQuery } from '../../graphql/user.graphql';
import { Query, Mutation, compose, graphql, withApollo } from 'react-apollo';

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
			rightColor: Colors.tintGray //正确答案颜色
		};
	}

	//提交答案 下一题
	async submitAnswer(question, refetch) {
		const { user, navigation } = this.props;
		const { category } = navigation.state.params;
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
				Methods.toast(str, -100); //Toast错误信息  后端暂停服务需求
			}
		} else {
			//下一题
			this.setState({
				isMethod: false,
				value: '',
				name: '提交答案',
				pickColor: Colors.theme,
				buttonColor: Colors.blue,
				rightColor: Colors.tintGray
			});
			refetch({ category_id: category.id });
		}
	}

	render() {
		const { navigation, user, noTicketTips } = this.props;
		let { value, isMethod, isShow, pickColor, name, buttonColor, rightColor } = this.state;
		const { category, question_id } = navigation.state.params;
		return (
			<Screen routeName={'答题'} customStyle={{ backgroundColor: Colors.theme }}>
				<Query
					query={QuestionsQuery}
					variables={{ category_id: category.id, id: question_id }}
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
						if (!(data && data.questions))
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
						let questions = data.questions;

						//转义 防止后端数据错误
						// let selections = data.question.selections.replace(/\\/g, '');
						// let option = '';
						// try {
						// 	option = JSON.parse(selections);
						// } catch (error) {
						// 	<LoadingError reload={() => refetch()} />;
						// }

						return (
							<View>
								<TabTop user={user} isShow={isShow} isAnswer={true} />
								<Banner />
								<FlatList
									style={[styles.questionWrap, { height: Divice.height, width: Divice.width }]}
									horizontal={true}
									bounces={false}
									showsHorizontalScrollIndicator={false}
									keyboardShouldPersistTaps="always"
									pagingEnabled
									removeClippedSubviews
									data={data.questions}
									keyExtractor={(item, index) => 'key_' + item.id}
									renderItem={this._questionItem}
									// ListFooterComponent={() => <ListFooter finished={finished} />}
									// getItemLayout={(data, index) => ({
									// 	length: SCREEN_HEIGHT,
									// 	offset: SCREEN_HEIGHT * index,
									// 	index
									// })}
									// onMomentumScrollEnd={e => this.onMomentumScrollEnd(e, articles, fetchMore)}
								/>
							</View>
						);
					}}
				</Query>
			</Screen>
		);
	}

	_questionItem = ({ item, index }) => {
		const { navigation, user, noTicketTips } = this.props;
		let { value, isMethod, isShow, pickColor, name, buttonColor, rightColor } = this.state;
		const { category, question_id } = navigation.state.params;

		let selections = item.selections.replace(/\\/g, '');
		let option = '';
		try {
			option = JSON.parse(selections);
		} catch (error) {}

		console.log('option', option);
		return (
			<ScrollView>
				<View style={styles.content}>
					<ErrorBoundary reload={() => refetch()}>
						<Question
							question={item}
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
					<View style={styles.submit}>
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
								gold={item.gold}
								user={data.user}
								noTicketTips={noTicketTips}
								handleVisible={this.handleCorrectModal.bind(this)}
								CloseModal={this.CloseModal.bind(this)}
								title={item.answer.indexOf(value) > -1}
								answer={item.answer}
							/>
						);
					}}
				</Query>
			</ScrollView>
		);
	};

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
	content: {
		paddingTop: 30,
		paddingHorizontal: 30,
		height: Divice.height,
		width: Divice.width,
		borderWidth: 1,
		borderColor: Colors.themeRed
	},
	submit: {
		marginTop: 50,
		marginBottom: 30
	},
	correction: {
		alignItems: 'flex-end',
		paddingBottom: 15
	},
	correctionText: {
		color: Colors.orange,
		fontSize: 12,
		fontWeight: '200'
	},
	questionWrap: {
		// position: 'absolute',
		// top: 0,
		// left: 0,
		// right: 0,
		// bottom: 0,
		// transform: [{ rotateZ: '90deg' }],
		borderWidth: 5,
		borderColor: '#000',
		backgroundColor: '#fff',
		padding: 0
	}
});

export default connect(store => {
	return {
		user: store.users.user,
		noTicketTips: store.users.noTicketTips
	};
})(compose(graphql(QuestionAnswerMutation, { name: 'QuestionAnswerMutation' }))(withApollo(AnswerScreen)));
