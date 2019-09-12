/* eslint-disable @typescript-eslint/indent */
/*
 * @flow
 * created by wyk made in 2019-03-19 11:22:26
 */
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Animated, StatusBar } from 'react-native';
import {
    PageContainer,
    TouchFeedback,
    Iconfont,
    Banner,
    StatusView,
    PullChooser,
    Player,
    UpwardImage,
    beginnerGuidance,
    AnswerGuidance,
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
import ChooseOverlay from './components/ChooseOverlay';

import { compose, graphql, withApollo, GQL } from 'apollo';
import { app, config, observer } from 'store';

import { ttad } from 'native';
import { toJS } from 'mobx';

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
            min_level: 2,
            // answer_count: 1
        };
    }

    UNSAFE_componentWillMount() {
        this.fetchData();
    }

    componentDidMount() {
        const { me } = app;
        // 新手指导
        beginnerGuidance({
            guidanceKey: 'Answer',
            GuidanceView: AnswerGuidance,
            dismissEnabled: true,
        });

        fetch(Config.ServerRoot + '/api/app/task/user-config?api_token=' + me.token)
            .then(response => response.json())
            .then(result => {
                this.setState({
                    min_level: result.chuti.min_level,
                });
            })
            .catch(err => {
                console.warn('加载task config err', err);
            });

        this.loadAd();
    }

    /*
      答题相关逻辑
    */
    async fetchData() {
        try {
            const result = await this.props.client.query({
                query: GQL.QuestionListQuery,
                variables: { category_id: this.category_id, limit: 10 },
                fetchPolicy: 'network-only',
            });
            const questions = Tools.syncGetter('questions', result.data);
            if (questions && questions instanceof Array && questions.length > 0) {
                this.questions = [...questions];
                this.resetState();
            } else {
                this.setState({ finished: true });
            }
        } catch (error) {
            const str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
            this.setState({ error });
        }
    }

    // 提交后显示模态框
    // 计算模态框所需参数
    showResultsOverlay() {
        const { question, answer, auditStatus } = this.state;
        const { data } = this.props;
        const { user = {} } = data;
        let result;
        const type = Number(question.status) === 0 ? 'audit' : 'answer';
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
                    status: status > 0 ? true : false,
                },
                refetchQueries: () => [
                    {
                        query: GQL.UserMetaQuery,
                        variables: { id: app.me.id },
                        fetchPolicy: 'network-only',
                    },
                ],
            });
        } catch (errors) {
            const str = errors.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
            this.setState({ auditStatus: 0 });
        }
        this.setState({ submited: true });
    };

    // 提交按钮
    onSubmit = () => {
        if (this.state.submited || !this.state.answer) {
            this.nextQuestion();
        } else {
            this.submitAnswer();
        }
    };

    // 提交答案
    submitAnswer = async () => {
        const { answer, question } = this.state;
        let result = {};
        if (answer) {
            this.showResultsOverlay();
            this.setState({
                submited: true,
            });
        }
        try {
            result = await this.props.QuestionAnswerMutation({
                variables: {
                    id: question.id,
                    answer: answer.join(''),
                },
                errorPolicy: 'all',
                refetchQueries: () => [
                    {
                        query: GQL.UserMetaQuery,
                        variables: { id: app.me.id },
                        fetchPolicy: 'network-only',
                    },
                ],
            });
        } catch (ex) {
            result.errors = ex;
        }
        this.showUpward();
        if (result && result.errors) {
            const str = result.errors[0].message;
            Toast.show({ content: str });
        }
    };

    // 下一题
    nextQuestion = () => {
        this.hideUpward();
        const { data } = this.props;

        const adinfo = {
            tt_appid: Tools.syncGetter('user.adinfo.bannerAd.appid', data),
            tt_codeid: Tools.syncGetter('user.adinfo.bannerAd.codeid', data),
        };

        if (this.questions.length === 0) {
            this.refetchQuery();
        } else {
            this.resetState();
        }

        this.answer_count = this.answer_count + 1;
        const error_rate = this.error_count / this.answer_count;

        if (this.answer_count === 10 && config.enableQuestion) {
            const answer_result = error_rate >= 0.5 ? false : true;
            this.showBannerAd(adinfo, answer_result);
            this.error_count = 0;
            this.answer_count = 0;
        }
    };

    // 加载更多题目
    async refetchQuery() {
        this.setState({ question: null });
        this.fetchData();
    }

    /*
      UI相关展示交互
    */
    showUpward() {
        if (this.markView) {
            this.markView.measure((x, y, width, height, pageX, pageY) => {
                if (Tools.syncGetter('explanation', this.state.question) && pageY >= this.containerHeight) {
                    this._upwardImage && this._upwardImage.show();
                }
            });
        }
    }

    onContainerLayout = event => {
        if (event) {
            const { x, y, width, height } = event.nativeEvent.layout;
            this.containerHeight = height;
        }
    };

    onScroll = () => {
        this.hideUpward();
    };

    hideUpward() {
        this._upwardImage && this._upwardImage.hide();
    }

    // 切换题目,重置UI状态
    resetState() {
        this.setState(
            preState => ({
                question: this.questions.shift(),
                submited: false,
                answer: null,
                auditStatus: 0,
            }),
            () => {
                this._animated.setValue(0);
                Animated.timing(this._animated, {
                    toValue: 1,
                    duration: 400,
                }).start();
            },
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

    // 选择的选项
    // 单选/多选：单选会清除其它已选择的选项
    selectOption = (value, singleOption) => {
        let { answer } = this.state;
        if (!answer) {
            answer = [];
        }
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
        const { navigation, data } = this.props;
        const { question } = this.state;
        const { category = {} } = navigation.state.params;
        ISIOS
            ? PullChooser.show([
                  {
                      title: '举报',
                      onPress: () => navigation.navigate('ReportQuestion', { question }),
                  },
                  {
                      title: '分享',
                      onPress: () => navigation.navigate('ShareCard', { question }),
                  },
              ])
            : ChooseOverlay.show(question, navigation, category, this.state.min_level, data.user);
    };

    /*
      广告业务逻辑
    */
    // 加载banner广告dialog
    async showBannerAd(adinfo, answer_result) {
        const click = await ttad.Banner.loadBannerAd(adinfo, answer_result);
        switch (click) {
            case 'LoadRewardVideo':
                // 加载激励视频
                this.loadRewardVideo(answer_result);
                break;

            case 'LoadFullScreenVideo':
                // 加载全屏视频
                this.loadFullScreenVideo();
                break;
            case 'Close':
                // 跳过广告
                // 做数据上报
                break;
        }
    }

    // 加载广告缓存
    loadAd() {
        const { data } = this.props;
        if (data && data.user && !ISIOS && config.enableQuestion) {
            const fullScreenVideoAdinfo = {
                tt_appid: Tools.syncGetter('user.adinfo.fullScreenVideoAd.appid', this.props.data),
                tt_codeid: Tools.syncGetter('user.adinfo.fullScreenVideoAd.codeid', this.props.data),
            };

            const rewardVideoAdinfo = {
                tt_appid: Tools.syncGetter('user.adinfo.tt_appid', this.props.data),
                tt_codeid: Tools.syncGetter('user.adinfo.tt_codeid', this.props.data),
                uid: data.user.id,
            };

            ttad.FullScreenVideo.loadFullScreenVideoAd(fullScreenVideoAdinfo).then(result => {
                this.loadFullVideoAd = result;
            });

            ttad.RewardVideo.loadAd(rewardVideoAdinfo).then(result => {
                this.loadRewardVideoAd = result;
            });
        }
    }

    // 加载全屏视频广告
    loadFullScreenVideo = () => {
        const { data } = this.props;
        const adinfo = {
            tt_appid: Tools.syncGetter('user.adinfo.fullScreenVideoAd.appid', data),
            tt_codeid: Tools.syncGetter('user.adinfo.fullScreenVideoAd.codeid', data),
        };

        if (this.loadFullVideoAd) {
            this.startFullScreenVideoAd(adinfo);
        } else {
            ttad.FullScreenVideo.loadFullScreenVideoAd(adinfo).then(() => {
                this.startFullScreenVideoAd(adinfo);
            });
        }
    };

    // 展示全屏视频
    startFullScreenVideoAd = adinfo => {
        ttad.FullScreenVideo.startFullScreenVideoAd(adinfo).then(result => {
            if (result) {
                // 发放奖励 banner弹窗
                UserReward({
                    variables: {
                        reward: 'FULL_SCREEN_VIDEO_REWARD;',
                    },
                    errorPolicy: 'all',
                }).then(res => {
                    this.loadRewardDialog(res);
                });
            }
        });
    };

    // 加载激励视频
    loadRewardVideo = answer_result => {
        const { data } = this.props;
        const adinfo = {
            tt_appid: Tools.syncGetter('user.adinfo.tt_appid', data),
            tt_codeid: Tools.syncGetter('user.adinfo.tt_codeid', data),
            uid: data.user.id,
        };

        if (this.loadRewardVideoAd) {
            this.startRewardVideo(adinfo);
        } else {
            ttad.RewardVideo.loadAd(adinfo).then(() => {
                this.startRewardVideo(adinfo, answer_result);
            });
        }
    };

    // 展示激励视频
    startRewardVideo = (adinfo, answer_result) => {
        const { UserReward } = this.props;
        ttad.RewardVideo.startAd(adinfo).then(result => {
            if (result) {
                // 发放奖励 banner弹窗
                UserReward({
                    variables: {
                        reward: answer_result ? 'SUCCESS_ANSWER_VIDEO_REWARD' : 'FAIL_ANSWER_VIDEO_REWARD',
                    },
                    errorPolicy: 'all',
                }).then(res => {
                    this.loadRewardDialog(res);
                });
            }
        });
    };

    // 加载奖励结果提示
    loadRewardDialog(res) {
        const { data, navigation } = this.props;
        const rewardDialogAdinfo = {
            tt_appid: Tools.syncGetter('user.adinfo.bannerAd.appid', data),
            tt_codeid: Tools.syncGetter('user.adinfo.bannerAd.codeid', data),
        };
        ttad.RewardDialog.loadRewardDialog(rewardDialogAdinfo, res.data.userReward).then(result => {
            if (result === 'Confirm') {
                navigation.navigate('BillingRecord', { initialPage: 1 });
            }
        });
    }

    renderContent = () => {
        const { answer, submited, question, finished, auditStatus, error } = this.state;
        const { navigation } = this.props;
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
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };
        const footerStyle = {
            opacity: this._animated,
            transform: [
                {
                    translateY: this._animated.interpolate({
                        inputRange: [0, 1],
                        outputRange: [PxFit(80), 0],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };
        const audit = question.status === 0;
        return (
            <React.Fragment>
                {!config.isFullScreen && <Banner isAnswer showWithdraw />}
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollStyle,
                        {
                            paddingBottom: audit ? SCREEN_WIDTH / 3 : 0,
                        },
                    ]}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    scrollEnabled={!config.isFullScreen}
                    onScroll={this.onScroll}>
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
                        ref={ref => (this.markView = ref)}>
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
                            onPress={this.showOptions}>
                            <Iconfont name="more-vertical" color="#fff" size={PxFit(18)} />
                        </TouchFeedback>
                    }
                    hiddenNavBar={config.isFullScreen}
                    onLayout={this.onContainerLayout}>
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
        flex: 1,
    },
    content: {
        marginBottom: PxFit(Theme.itemSpace),
        paddingTop: PxFit(20),
    },
    optionsButton: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        width: PxFit(40),
    },
    scrollStyle: {
        backgroundColor: '#fefefe',
        flexGrow: 1,
    },
    withdrawProgress: {
        bottom: PxFit(80) + Theme.HOME_INDICATOR_HEIGHT,
        position: 'absolute',
        right: PxFit(20),
    },
});

export default compose(
    withApollo,
    graphql(GQL.QuestionAnswerMutation, { name: 'QuestionAnswerMutation' }),
    graphql(GQL.auditMutation, { name: 'auditMutation' }),
    graphql(GQL.UserMeansQuery, {
        options: props => ({ variables: { id: app.me.id } }),
    }),
    graphql(GQL.UserRewardMutation, { name: 'UserReward' }),
)(index);
