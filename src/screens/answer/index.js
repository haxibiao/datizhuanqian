/*
 * @flow
 * created by wyk made in 2019-03-19 11:22:26
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Animated, Easing, StatusBar } from 'react-native';
import {
	PageContainer,
	TouchFeedback,
	Iconfont,
	Banner,
	StatusView,
	PullChooser,
	Player,
	UpwardImage
} from 'components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Tools, ISIOS, Config } from 'utils';

import UserInfo from '../question/components/UserInfo';
import QuestionBody from '../question/components/QuestionBody';
import QuestionOptions from '../question/components/QuestionOptions';
import AnswerBar from '../question/components/AnswerBar';
import Explain from '../question/components/Explain';
import VideoExplain from '../question/components/VideoExplain';

import CommentOverlay from '../comment/CommentOverlay';

import AnswerPlaceholder from './components/AnswerPlaceholder';
import FooterBar from './components/FooterBar';
import AuditTitle from './components/AuditTitle';
import Audit from './components/Audit';
import AnswerOverlay from './components/AnswerOverlay';
import SystemUpdateTips from './components/SystemUpdateTips';
import ChooseOverlay from './components/ChooseOverlay';
import WithdrawCircleProgress from './components/WithdrawCircleProgress';

import { Overlay } from 'teaset';
import { Query, compose, graphql, withApollo, GQL } from 'apollo';
import { app, config, observer } from 'store';

import { TtAdvert } from 'native';

let VIDEO_WIDTH = SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2;

@observer
class index extends Component {
	constructor(props) {
		super(props);
		this.questions = null;
		this.gold = 0;
		this.ticket = 0;
		this._animated = new Animated.Value(0);
		this.onSubmitOpinion = Tools.throttle(this.onSubmitOpinion, 1500);
		this.onSubmit = Tools.throttle(this.onSubmit, 1500);
		this.category_id = props.navigation.getParam('category', {}).id;
		this.containerHeight = SCREEN_HEIGHT - PxFit(170);
		this.answer_count = 0;
		this.error_count = 0;
		this.loadFullVideoAd = false;
		this.state = {
			question: null,
			submited: false,
			answer: null,
			auditStatus: 0,
			finished: false,
			shieldingAd: null,
			min_level: 2
			// answer_count: 1
		};
	}

	UNSAFE_componentWillMount() {
		this.fetchData();
	}

	componentDidMount() {
		const { data } = this.props;
		let { me } = app;

		if (!ISIOS && config.enableQuestion) {
			this.CloseAdlistener = TtAdvert.Banner.addListener('CloseAd', this.loadFullScreenVideo);
			this.BuyAdlistener = TtAdvert.Banner.addListener('BuyAd', this.ShieldingCategoryAd);
			//挂载广告提示弹窗按钮的监听事件
		}

		fetch(Config.ServerRoot + '/api/app/task/user-config?api_token=' + me.token)
			.then(response => response.json())
			.then(data => {
				this.setState({
					min_level: data.chuti.min_level
				});
			})
			.catch(err => {
				console.log('加载task config err', err);
			});

		if (data && data.user && !ISIOS && config.enableQuestion) {
			let adinfo = {
				tt_appid: Tools.syncGetter('user.adinfo.fullScreenVideoAd.appid', this.props.data),
				tt_codeid: Tools.syncGetter('user.adinfo.fullScreenVideoAd.codeid', this.props.data)
			};
			TtAdvert.FullScreenVideo.loadFullScreenVideoAd(adinfo).then(data => {
				this.loadFullVideoAd = data;
			});
		}
	}

	componentWillUnmount() {
		if (!ISIOS && config.enableQuestion) {
			this.CloseAdlistener.remove();
			this.BuyAdlistener.remove();
		}
	}

	loadFullScreenVideo = () => {
		const { data } = this.props;

		let adinfo = {
			tt_appid: Tools.syncGetter('user.adinfo.fullScreenVideoAd.appid', data),
			tt_codeid: Tools.syncGetter('user.adinfo.fullScreenVideoAd.codeid', data)
		};

		if (this.loadFullVideoAd) {
			TtAdvert.FullScreenVideo.startFullScreenVideoAd(adinfo);
		} else {
			TtAdvert.FullScreenVideo.loadFullScreenVideoAd(adinfo).then(data => {
				TtAdvert.FullScreenVideo.startFullScreenVideoAd(adinfo);
			});
		}
	};

	ShieldingCategoryAd = () => {
		// let { user } = this.props;
		this.props
			.ShieldingCategoryAd({
				variables: {
					category_id: this.category_id
				},
				refetchQueries: () => [
					{
						query: GQL.CategoriesQuery,
						fetchPolicy: 'network-only'
					},
					{
						query: GQL.UserMetaQuery,
						variables: { id: app.me.id },
						fetchPolicy: 'network-only'
					}
				]
			})
			.then(data => {
				Toast.show({ content: `成功跳过惩罚` });
			})
			.catch(err => {
				Toast.show({ content: `成功跳过惩罚` });
			});
	};

	async fetchData() {
		try {
			let result = await this.props.client.query({
				query: GQL.QuestionListQuery,
				variables: { category_id: this.category_id, limit: 10 },
				fetchPolicy: 'network-only'
			});
			let questions = Tools.syncGetter('questions', result.data);
			if (questions && questions instanceof Array && questions.length > 0) {
				this.questions = [...questions];
				this.resetState();
			} else {
				this.setState({ finished: true });
			}
		} catch (error) {
			let str = error.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str });
			this.setState({ error });
		}
	}

	// 提交后显示模态框
	// 计算模态框所需参数
	showResultsOverlay() {
		let { question, answer, auditStatus } = this.state;
		let { data } = this.props;
		let { user = {} } = data;
		let result, type;
		type = Number(question.status) === 0 ? 'audit' : 'answer';
		if (type === 'audit') {
			this.gold = 0;
			this.ticket = question.ticket;
			result = auditStatus > 0 ? true : false;
		} else {
			if (question.answer === answer.sort().join('')) {
				this.gold = question.gold;
				this.ticket = user.ticket > 0 ? user.ticket : 0;
				result = true;
			} else {
				this.gold = 0;
				this.ticket = question.ticket;
				result = false;
				this.error_count = this.error_count + 1;
			}
		}
		AnswerOverlay.show({ gold: this.gold, ticket: this.ticket, result, type });
	}

	// 提交审核
	onSubmitOpinion = async status => {
		this.setState({ auditStatus: status }, () => {
			this.showResultsOverlay();
		});
		try {
			await this.props.auditMutation({
				variables: {
					question_id: this.state.question.id,
					status: status > 0 ? true : false
				},
				refetchQueries: () => [
					{
						query: GQL.UserMetaQuery,
						variables: { id: app.me.id },
						fetchPolicy: 'network-only'
					}
				]
			});
		} catch (errors) {
			let str = errors.toString().replace(/Error: GraphQL error: /, '');
			Toast.show({ content: str });
			this.setState({ auditStatus: 0 });
		}
		this.setState({ submited: true });
	};

	onSubmit = () => {
		if (this.state.submited) {
			//下一题
			this.nextQuestion();
		} else {
			//提交答案
			this.submitAnswer();
		}
	};

	submitAnswer = async () => {
		let { answer, question } = this.state;
		let result = {};
		if (answer) {
			this.showResultsOverlay();
			this.setState({
				submited: true
			});
		}
		try {
			result = await this.props.QuestionAnswerMutation({
				variables: {
					id: question.id,
					answer: answer.join('')
				},
				errorPolicy: 'all',
				refetchQueries: () => [
					{
						query: GQL.UserMetaQuery,
						variables: { id: app.me.id },
						fetchPolicy: 'network-only'
					}
				]
			});
		} catch (ex) {
			result.errors = ex;
		}
		this.showUpward();
		if (result && result.errors) {
			let str = result.errors[0].message;
			Toast.show({ content: str });
		}
	};

	onContainerLayout = event => {
		if (event) {
			let { x, y, width, height } = event.nativeEvent.layout;
			this.containerHeight = height;
		}
	};

	showUpward() {
		if (this.markView) {
			this.markView.measure((x, y, width, height, pageX, pageY) => {
				if (Tools.syncGetter('explanation', this.state.question) && pageY >= this.containerHeight) {
					this._upwardImage && this._upwardImage.show();
				}
			});
		}
	}

	hideUpward() {
		this._upwardImage && this._upwardImage.hide();
	}

	onScroll = () => {
		this.hideUpward();
	};

	nextQuestion = () => {
		this.hideUpward();
		const { data } = this.props;

		let adinfo = {
			tt_appid: Tools.syncGetter('user.adinfo.bannerAd.appid', data),
			tt_codeid: Tools.syncGetter('user.adinfo.bannerAd.codeid', data)
		};

		if (this.questions.length === 0) {
			this.refetchQuery();
		} else {
			this.resetState();
		}

		this.answer_count = this.answer_count + 1;
		let error_rate = this.error_count / this.answer_count;
		if (this.answer_count == 10) {
			if (error_rate >= 0.5 && config.enableQuestion) {
				setTimeout(() => {
					TtAdvert.Banner.loadBannerAd(adinfo);
				}, 1000);
			}

			this.error_count = 0;
			this.answer_count = 0;
		}
	};

	// 加载更多题目
	async refetchQuery() {
		this.setState({ question: null });
		this.fetchData();
	}

	// 切换题目,重置UI状态
	resetState() {
		this.setState(
			preState => ({
				question: this.questions.shift(),
				submited: false,
				answer: null,
				auditStatus: 0
			}),
			() => {
				this._animated.setValue(0);
				Animated.timing(this._animated, {
					toValue: 1,
					duration: 400
				}).start();
			}
		);
	}

	commentHandler = () => {
		if (!this.state.submited) {
			Toast.show({ content: '答题后再评论哦', layout: 'bottom' });
		} else {
			this.showComment();
		}
	};

	showComment = () => {
		this._commentOverlay && this._commentOverlay.slideUp();
	};

	hideComment = () => {
		this._commentOverlay && this._commentOverlay.slideDown();
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

	showOptions = () => {
		let { navigation, data } = this.props;
		let { question } = this.state;
		const { category = {} } = navigation.state.params;
		ISIOS
			? PullChooser.show([
					{
						title: '举报',
						onPress: () => navigation.navigate('ReportQuestion', { question })
					},
					{
						title: '分享',
						onPress: () => navigation.navigate('ShareCard', { question })
					}
			  ])
			: ChooseOverlay.show(question, navigation, category, this.state.min_level, data.user);
	};

	renderContent = () => {
		let { answer, submited, question, finished, auditStatus, error } = this.state;
		const { navigation, data } = this.props;
		const { category = {} } = this.props.navigation.state.params;
		if (error) {
			return <StatusView.ErrorView onPress={this.fetchData} error={error} />;
		} else if (!question && finished) {
			return (
				<StatusView.EmptyView
					titleStyle={{ textAlign: 'center', fontSize: PxFit(13), lineHeight: PxFit(18) }}
					title={`暂时没有题目了，刷新几次试试看吧！\n我们会不断更新，先去其它分类下答题吧~`}
				/>
			);
		} else if (!question) {
			return <AnswerPlaceholder answer />;
		}
		const bodyStyle = {
			opacity: this._animated,
			transform: [
				{
					translateY: this._animated.interpolate({
						inputRange: [0, 1],
						outputRange: [-SCREEN_WIDTH, 0],
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
						outputRange: [PxFit(80), 0],
						extrapolate: 'clamp'
					})
				}
			]
		};
		let audit = question.status === 0;
		return (
			<React.Fragment>
				{!config.isFullScreen && <Banner isAnswer showWithdraw />}
				<ScrollView
					contentContainerStyle={[
						styles.scrollStyle,
						{
							paddingBottom: audit ? SCREEN_WIDTH / 3 : 0
						}
					]}
					keyboardShouldPersistTaps="always"
					showsVerticalScrollIndicator={false}
					bounces={false}
					scrollEnabled={!config.isFullScreen}
					onScroll={this.onScroll}
				>
					<View style={styles.content}>
						<Animated.View style={[{ marginHorizontal: PxFit(Theme.itemSpace) }, bodyStyle]}>
							<UserInfo
								question={question}
								navigation={navigation}
								shieldingAd={this.state.shieldingAd}
								category={category}
							/>
							<QuestionBody question={question} audit={audit} />
						</Animated.View>
						{question.video && question.video.url && (
							<Player style={{ marginTop: PxFit(Theme.itemSpace) }} video={question.video} />
						)}

						<View style={{ marginHorizontal: PxFit(Theme.itemSpace), marginTop: PxFit(20) }}>
							<QuestionOptions
								questionId={question.id}
								selections={question.selections_array}
								onSelectOption={this.selectOption}
								submited={audit || submited}
								answer={question.answer}
								selectedOption={answer}
							/>
						</View>
					</View>
					<View
						style={{ marginHorizontal: PxFit(Theme.itemSpace), zIndex: -1 }}
						ref={ref => (this.markView = ref)}
					>
						{audit ? (
							<AuditTitle navigation={navigation} />
						) : (
							<AnswerBar isShow={audit || submited} question={question} navigation={navigation} />
						)}
						{(audit || submited) && (
							<VideoExplain video={Tools.syncGetter('explanation.video', question)} />
						)}
						{(audit || submited) && (
							<Explain
								text={Tools.syncGetter('explanation.content', question)}
								picture={Tools.syncGetter('explanation.images.0.path', question)}
							/>
						)}
					</View>
					{audit && <Audit status={auditStatus} onSubmitOpinion={this.onSubmitOpinion} />}
				</ScrollView>
				{!config.isFullScreen && (
					<Animated.View style={footerStyle}>
						{audit ? (
							<FooterBar
								audit
								answer
								question={question}
								navigation={navigation}
								submited={submited}
								showComment={this.showComment}
								oSubmit={this.nextQuestion}
							/>
						) : (
							<FooterBar
								navigation={navigation}
								question={question}
								submited={submited}
								answer={answer}
								showComment={this.commentHandler}
								oSubmit={this.onSubmit}
							/>
						)}
					</Animated.View>
				)}
				<UpwardImage
					ref={ref => (this._upwardImage = ref)}
					style={{ bottom: PxFit(48) + Theme.HOME_INDICATOR_HEIGHT }}
				/>
			</React.Fragment>
		);
	};

	render() {
		const { category = {} } = this.props.navigation.state.params;
		return (
			<React.Fragment>
				<PageContainer
					title={category.name || '答题'}
					autoKeyboardInsets={false}
					onWillBlur={this.hideComment}
					rightView={
						<TouchFeedback
							disabled={!this.state.question}
							style={styles.optionsButton}
							onPress={this.showOptions}
						>
							<Iconfont name="more-vertical" color="#fff" size={PxFit(18)} />
						</TouchFeedback>
					}
					hiddenNavBar={config.isFullScreen}
					onLayout={this.onContainerLayout}
				>
					{config.isFullScreen && <StatusBar translucent={true} hidden />}

					<View style={styles.container}>{this.renderContent()}</View>
				</PageContainer>
				<CommentOverlay ref={ref => (this._commentOverlay = ref)} question={this.state.question} />
			</React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	scrollStyle: {
		flexGrow: 1,
		backgroundColor: '#fefefe'
	},
	optionsButton: {
		flex: 1,
		width: PxFit(40),
		alignItems: 'flex-end',
		justifyContent: 'center'
	},
	content: {
		paddingTop: PxFit(20),
		marginBottom: PxFit(Theme.itemSpace)
	},
	withdrawProgress: {
		position: 'absolute',
		right: PxFit(20),
		bottom: PxFit(80) + Theme.HOME_INDICATOR_HEIGHT
	}
});

export default compose(
	withApollo,
	graphql(GQL.QuestionAnswerMutation, { name: 'QuestionAnswerMutation' }),
	graphql(GQL.auditMutation, { name: 'auditMutation' }),
	graphql(GQL.ShieldingCategoryAdMutation, { name: 'ShieldingCategoryAd' }),
	graphql(GQL.UserMeansQuery, {
		options: props => ({ variables: { id: app.me.id } })
	})
)(index);
