import React, { useState, Fragment, useEffect, useRef, useCallback } from 'react';
import { Text, View, Animated, StyleSheet, StatusBar, ScrollView } from 'react-native';

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
import { GQL, useMutation, useQuery } from 'apollo';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, Tools, ISIOS, Config } from 'utils';
import { app, config, observer } from 'store';
import { ttad } from 'native';
import { Overlay } from 'teaset';

import ChooseOverlay from './components/ChooseOverlay';
import AnswerOverlay from './components/AnswerOverlay';
import AnswerPlaceholder from './components/AnswerPlaceholder';
import FooterBar from './components/FooterBar';
import AuditTitle from './components/AuditTitle';
import Audit from './components/Audit';
import FirstWithdrawTips from './components/FirstWithdrawTips';
import AnswerResult from './components/AnswerResult';

import UserInfo from '../question/components/UserInfo';
import QuestionBody from '../question/components/QuestionBody';
import QuestionOptions from '../question/components/QuestionOptions';
import AnswerBar from '../question/components/AnswerBar';
import Explain from '../question/components/Explain';
import VideoExplain from '../question/components/VideoExplain';
import { List } from 'lodash';

type Props = {
    navigation: any;
};

const answer = (props: Props) => {
    const [gold, setGold] = useState(0);
    const [ticket, setTicket] = useState(0);
    const [errorCount, setErrorCount] = useState(0);
    const [answerCount, setanswerCount] = useState(0);
    const [question, setQuestion] = useState(Object);
    const [submited, setSubmited] = useState(false);
    const [answer, setAnswer] = useState(null);
    const [auditStatus, setAuditStatus] = useState(0);
    const [finished, setFinished] = useState(false);
    const [questions, setQuestions] = useState(Array);
    const [error, setError] = useState(null);
    const [containerHeight, setContainerHeight] = useState(SCREEN_HEIGHT - PxFit(170));

    const _animated = useRef(new Animated.Value(0));

    const category = props.navigation.getParam('category', {});

    const questionList = useQuery(GQL.QuestionListQuery, {
        variables: { category_id: category.id, limit: 10 },
    });

    const userMeans = useQuery(GQL.UserMeansQuery, {
        variables: { id: app.me.id },
    });

    useEffect(() => {
        fetchData();
    }, []);

    //取题
    const fetchData = () => {
        const { data, error, loading } = questionList;
        // console.log('fetchData data', data);
        if (error) {
            const str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
            setError(error);
            return;
        }
        if (loading) {
            return;
        }
        const _questions = Tools.syncGetter('questions', data);
        if (_questions && _questions instanceof Array && _questions.length > 0) {
            setQuestions(_questions);
            resetState(_questions);
        } else {
            setFinished(true);
        }
    };

    const onSubmitOpinion = async (status: any) => {
        setAuditStatus(status);
        showResultsOverlay();

        const { data, error } = useMutation(
            GQL.auditMutation({
                variables: {
                    question_id: question.id,
                    status: status > 0 ? true : false,
                },
                refetchQueries: () => [
                    {
                        query: GQL.UserMetaQuery,
                        variables: { id: app.me.id },
                        fetchPolicy: 'network-only',
                    },
                ],
            }),
        );
        if (error) {
            const str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
            setAuditStatus(0);
        }
        setSubmited(true);
    };

    // 提交按钮
    const onSubmit = () => {
        if (submited || !answer) {
            nextQuestion();
        } else {
            submitAnswer();
        }
    };

    const submitAnswer = async () => {
        const adinfo = {
            tt_appid: Tools.syncGetter('user.adinfo.bannerAd.appid', userMeans.data),
            tt_codeid: Tools.syncGetter('user.adinfo.bannerAd.codeid', userMeans.data),
        };

        let result = {};
        if (answer) {
            showResultsOverlay();
            setSubmited(true);
        }
    };

    // 下一题
    const nextQuestion = () => {
        hideUpward();
        setErrorCount(errorCount + 1);

        if (questions.length === errorCount) {
            refetchQuery();
        } else {
            resetState(questions);
        }

        // if (questions.length === 0) {
        //     refetchQuery();
        // } else {
        //     resetState(questions);
        // }
    };

    // 加载更多题目
    const refetchQuery = () => {
        // this.setState({ question: null });
        setQuestions(Object);
        fetchData();
    };

    // 提交后显示模态框
    // 计算模态框所需参数
    const showResultsOverlay = () => {
        const {
            data: { user = {} },
        } = userMeans;
        let result;
        const type = Number(question.status) === 0 ? 'audit' : 'answer';
        if (type === 'audit') {
            setGold(0);
            setTicket(question.ticket);
            result = auditStatus > 0 ? true : false;
        } else {
            if (question.answer === answer.sort().join('')) {
                setGold(question.gold);
                setTicket(user.ticket > 0 ? user.ticket : 0);
                result = true;
            } else {
                setGold(0);
                setTicket(question.ticket);
                result = false;
                setErrorCount(errorCount + 1);
            }
        }
        AnswerOverlay.show({ gold: gold, ticket: ticket, result, type });
    };

    const resetState = useCallback((_questions: any[]) => {
        // setQuestion(_questions.shift());
        console.log('resetState');
        setQuestion(_questions[answerCount]);
        setSubmited(false);
        setAnswer(null);
        setAuditStatus(0);

        _animated.current.setValue(0);
        Animated.timing(_animated.current, {
            toValue: 1,
            duration: 400,
        }).start();
    }, []);

    const onContainerLayout = (event: any) => {
        if (event) {
            const { x, y, width, height } = event.nativeEvent.layout;
            setContainerHeight(height);
        }
    };

    const onScroll = () => {
        hideUpward();
    };

    const hideUpward = () => {
        // _upwardImage && _upwardImage.hide();
    };

    const hideComment = () => {
        // this._commentOverlay && this._commentOverlay.slideDown();
    };

    // 选择的选项
    // 单选/多选：单选会清除其它已选择的选项
    const selectOption = useCallback((value: any, singleOption: any) => {
        let _answer: any = null;
        if (!_answer) {
            _answer = [];
        }
        if (singleOption) {
            if (_answer.includes(value)) {
                _answer = null;
            } else {
                _answer = [value];
            }
        } else {
            if (_answer.includes(value)) {
                _answer.splice(_answer.indexOf(value), 1);
                if (_answer.length < 1) {
                    _answer = null;
                }
            } else {
                _answer.push(value);
            }
        }
        setAnswer(_answer);
    }, []);

    const showOptions = () => {
        ISIOS
            ? PullChooser.show([
                  {
                      title: '举报',
                      onPress: () => props.navigation.navigate('ReportQuestion', { question }),
                  },
                  //   {
                  //       title: '分享',
                  //       onPress: () => props.navigation.navigate('ShareCard', { question }),
                  //   },
              ])
            : ChooseOverlay.show(question, props.navigation, category, 2, userMeans.data.user); //2 ： min_level 需写到config
    };

    const renderContent = () => {
        // const { answer, submited, question, finished, auditStatus, error } = this.state;
        // const { navigation } = this.props;
        // const { category = {} } = this.props.navigation.state.params;
        console.log('renderContent', question);
        if (error) {
            return <StatusView.ErrorView onPress={fetchData} error={error} />;
        }
        if (question.id && finished) {
            return (
                <StatusView.EmptyView
                    titleStyle={{ textAlign: 'center', fontSize: PxFit(13), lineHeight: PxFit(18) }}
                    title={`暂时没有题目了，刷新几次试试看吧！\n我们会不断更新，先去其它分类下答题吧~`}
                />
            );
        }
        if (!question.id) {
            return <AnswerPlaceholder answer />;
        }

        const bodyStyle = {
            opacity: _animated.current,
            transform: [
                {
                    translateY: _animated.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-SCREEN_WIDTH, 0],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };
        const footerStyle = {
            opacity: _animated.current,
            transform: [
                {
                    translateY: _animated.current.interpolate({
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
                {!config.isFullScreen && <Banner isAnswer showWithdraw navigation={props.navigation} />}
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
                    onScroll={onScroll}>
                    <View style={styles.content}>
                        <Animated.View style={[{ marginHorizontal: PxFit(Theme.itemSpace) }, bodyStyle]}>
                            <UserInfo question={question} navigation={props.navigation} category={category} />
                            <QuestionBody question={question} audit={audit} />
                        </Animated.View>
                        {question.video && question.video.url && (
                            <Player style={{ marginTop: PxFit(Theme.itemSpace) }} video={question.video} />
                        )}

                        <View style={{ marginHorizontal: PxFit(Theme.itemSpace), marginTop: PxFit(20) }}>
                            <QuestionOptions
                                questionId={question.id}
                                selections={question.selections_array}
                                onSelectOption={selectOption}
                                submited={audit || submited}
                                answer={question.answer}
                                selectedOption={answer}
                            />
                        </View>
                    </View>
                    <View
                        style={{ marginHorizontal: PxFit(Theme.itemSpace), zIndex: -1 }}
                        // ref={ref => (this.markView = ref)}
                    >
                        {audit ? (
                            <AuditTitle navigation={props.navigation} />
                        ) : (
                            <AnswerBar isShow={audit || submited} question={question} navigation={props.navigation} />
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
                </ScrollView>
                {!config.isFullScreen && (
                    <Animated.View style={footerStyle}>
                        <FooterBar
                            navigation={props.navigation}
                            question={question}
                            submited={submited}
                            answer={answer}
                            // showComment={this.commentHandler}
                            oSubmit={onSubmit}
                        />
                    </Animated.View>
                )}
            </React.Fragment>
        );
    };

    return (
        <Fragment>
            <PageContainer
                title={category.name || '答题'}
                autoKeyboardInsets={false}
                onWillBlur={hideComment}
                rightView={
                    <TouchFeedback disabled={!question} style={styles.optionsButton} onPress={showOptions}>
                        <Iconfont name="more-vertical" color="#fff" size={PxFit(18)} />
                    </TouchFeedback>
                }
                hiddenNavBar={config.isFullScreen}
                onLayout={onContainerLayout}>
                {config.isFullScreen && <StatusBar translucent={true} hidden />}
                <View style={styles.container}>{renderContent()}</View>
            </PageContainer>
        </Fragment>
    );
};

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
    overlayInner: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0)',
        flex: 1,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        width: SCREEN_WIDTH,
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

export default answer;
