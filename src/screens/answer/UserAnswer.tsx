import React, { useState, Fragment, useEffect, useRef, useCallback } from 'react';
import { View, Animated, StyleSheet, StatusBar, ScrollView, FlatList } from 'react-native';

import { PageContainer, TouchFeedback, Iconfont, Banner, StatusView, PullChooser, Player } from 'components';
import { GQL, useQuery } from 'apollo';

import { app, config, observer } from 'store';
import { Overlay } from 'teaset';

import ChooseOverlay from './components/ChooseOverlay';
import AnswerOverlay from './components/AnswerOverlay';
import AnswerPlaceholder from './components/AnswerPlaceholder';
import FooterBar from './components/FooterBar';
import AnswerAchievement from './components/AnswerAchievement';

import UserInfo from '../question/components/UserInfo';
import QuestionBody from '../question/components/QuestionBody';
import QuestionOptions from './components/QuestionOptions';
import AnswerBar from '../question/components/AnswerBar';
import Explain from '../question/components/Explain';
import VideoExplain from '../question/components/VideoExplain';
import CommentOverlay from '../comment/CommentOverlay';

import QuestionStore from './QuestionStore';

type Props = {
    navigation: any;
};

interface User {
    id: number;
    name: string;
    avatar: string;
    followed_user_status: number;
}

interface Video {
    id: number;
    width: number;
    height: number;
    url: string;
    cover?: string;
}

interface Question {
    id: never;
    description: string;
    count_likes: number;
    count_comments: number;
    liked: boolean;
    selections_array: Array<object>;
    answer: string;
    category: object;
    user: User;
    video: Video;
}

const AnswerScreen = observer((props: Props) => {
    const [errorCount, setErrorCount] = useState(0);
    const [answerCount, setAnswerCount] = useState(0);
    // const [question, setQuestion] = useState(Object);
    const [submited, setSubmited] = useState(false);
    const [answer, setAnswer] = useState(null);
    const [, setAuditStatus] = useState(0);
    const [finished] = useState(false);
    const [error] = useState(null);

    const { navigation } = props;
    const questions = navigation.getParam('questions') || [];
    const activeIndex = navigation.getParam('index') || 0;
    const user = navigation.getParam('user') || {};
    const orderByHot = navigation.getParam('orderByHot') || 'CREATED_AT';
    const _animated = useRef(new Animated.Value(0));
    const flatListRef = useRef();
    const commentRef = useRef();
    const viewConfig = useRef({
        waitForInteraction: true,
        viewAreaCoveragePercentThreshold: 95,
    });

    const data = QuestionStore.dataSource[QuestionStore.viewableItemIndex];

    const userMeans = useQuery(GQL.UserMeansQuery, {
        variables: { id: app.me.id },
    });

    const showComment = useCallback(() => {
        if (TOKEN) {
            commentRef.current.slideUp();
        } else {
            navigation.navigate('Login');
        }
    }, [commentRef]);

    const hideComment = useCallback(() => {
        commentRef.current.slideDown();
    }, [commentRef]);

    const commentHandler = isAnswered => {
        if (!submited && !isAnswered) {
            Toast.show({ content: '答题后再评论哦', layout: 'bottom' });
        } else {
            showComment();
        }
    };

    useEffect(() => {
        QuestionStore.viewableItemIndex = activeIndex;

        QuestionStore.addSource(questions);

        const navWillFocusListener = navigation.addListener('willFocus', () => {
            if (QuestionStore.viewableItemIndex < 0) {
                QuestionStore.viewableItemIndex = 0;
            }
        });
        const navWillBlurListener = navigation.addListener('willBlur', () => {
            hideComment();
        });

        return () => {
            navWillFocusListener.remove();
            navWillBlurListener.remove();
            QuestionStore.dataSource = [];
            QuestionStore.viewableItemIndex = -1;
        };
    }, []);

    const questionsQuery = useCallback(() => {
        return app.client.query({
            query: GQL.UserInfoQuery,
            variables: {
                id: user.id,
                order: orderByHot,
                offset: QuestionStore.dataSource.length,
                filter: 'publish',
            },
            fetchPolicy: 'network-only',
        });
    }, [app.client]);

    //取题
    const fetchData = useCallback(async () => {
        if (!QuestionStore.isLoadMore) {
            QuestionStore.isLoadMore = true;
            const [error, result] = await Helper.exceptionCapture(questionsQuery);
            console.log('result', result, error);
            const questionsSource = Helper.syncGetter('data.user.questions', result);

            if (error) {
                QuestionStore.isError = true;
            } else {
                if (Array.isArray(questionsSource) && questionsSource.length > 0) {
                    console.log('questionsSource', questionsSource);
                    QuestionStore.addSource(questionsSource);
                } else {
                    QuestionStore.isFinish = true;
                }
            }
            QuestionStore.isLoadMore = false;
        }
    }, [questionsQuery]);

    // 提交按钮
    const onSubmit = (question: any) => {
        if (submited || !answer) {
            nextQuestion();
        } else {
            submitAnswer(question);
        }
    };

    const submitAnswer = async (question: { id: any }) => {
        if (answer) {
            showResultsOverlay(question);
            setSubmited(true);
        }

        app.mutationClient
            .mutate({
                mutation: GQL.QuestionAnswerMutation,
                variables: {
                    id: question.id,
                    answer: answer.join('') || 'A',
                },
                errorPolicy: 'all',
                refetchQueries: () => [
                    {
                        query: GQL.UserMetaQuery,
                        variables: { id: app.me.id },
                        fetchPolicy: 'network-only',
                    },
                ],
            })
            .then(() => {
                //存储题目ID
            })
            .catch((error: any) => {
                console.log('error :', error);
                // const str = result.errors[0].message;
                // Toast.show({ content: str });
            });

        showAnswerResultAd();
    };

    const showAnswerResultAd = () => {
        setAnswerCount(answerCount + 1);
        // this.showAnswerResult(this.answer_count, this.error_count);
        // 广告触发, iOS不让苹果审核轻易发现答题触发广告，设置多一点，比如答题100个
        // 安卓提高到5个题计算及格和视频奖励
        console.log('answerCount :', answerCount);
        const adWillShowCount = config.disableAd ? 100 : 5;
        if (answerCount + 1 == adWillShowCount) {
            AnswerAchievement.show({
                answerCount: answerCount + 1,
                errorCount: errorCount,
            });
            setErrorCount(0);
            setAnswerCount(0);
        }
    };

    // 下一题
    const nextQuestion = () => {
        if (submited) {
            QuestionStore.addQusetionId(data);
            resetState();
        }

        if (QuestionStore.dataSource.length > QuestionStore.viewableItemIndex + 1) {
            flatListRef.current.scrollToIndex({ index: QuestionStore.viewableItemIndex + 1, animated: true });
        } else {
            Toast.show({
                content: '正在加载中...',
            });
        }
    };

    // 提交后显示模态框
    // 计算模态框所需参数
    const showResultsOverlay = (question: { id?: any; answer?: any; gold?: any; ticket?: any }) => {
        const {
            data: { user = {} },
        } = userMeans;
        let result = false;
        let gold = 0;
        let ticket = 0;
        if (question.answer == answer.sort().join('')) {
            gold = question.gold;
            ticket = user.ticket > 0 ? user.ticket : 0;
            result = true;
        } else {
            ticket = question.ticket;
            setErrorCount(errorCount + 1);
        }

        AnswerOverlay.show({ gold: gold, ticket: ticket, result, type: 'answer', question });
    };

    const resetState = useCallback(() => {
        setSubmited(false);
        setAnswer(null);
        setAuditStatus(0);

        _animated.current.setValue(0);
        Animated.timing(_animated.current, {
            toValue: 1,
            duration: 400,
        }).start();
    }, []);

    const onContainerLayout = useCallback(event => {
        const { width } = event.nativeEvent.layout;
        app.viewportWidth = width;
    }, []);

    const onScroll = () => {
        hideUpward();
    };

    const hideUpward = () => {
        // _upwardImage && _upwardImage.hide();
    };

    // 选择的选项
    // 单选/多选：单选会清除其它已选择的选项
    const selectOption = (value: any, singleOption: any) => {
        let _answer = answer;

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
                _answer = _answer.slice(_answer.indexOf(value));
                if (_answer.length < 1) {
                    _answer = null;
                }
            } else {
                _answer = _answer.concat(value);
            }
        }
        setAnswer(_answer);
    };

    const showOptions = () => {
        Device.IOS
            ? PullChooser.show([
                  {
                      title: '举报',
                      onPress: () => props.navigation.navigate('ReportQuestion', { question: data }),
                  },
                  //   {
                  //       title: '分享',
                  //       onPress: () => props.navigation.navigate('ShareCard', { question }),
                  //   },
              ])
            : ChooseOverlay.show(data, props.navigation, data.category, 2, userMeans.data.user); //2 ： min_level 需写到config
    };

    const getVisibleRows = useCallback(info => {
        if (info.viewableItems[0]) {
            QuestionStore.viewableItemIndex = info.viewableItems[0].index;
        }
    }, []);

    const onMomentumScrollBegin = (question: Question) => {
        if (submited) {
            resetState();
            QuestionStore.addQusetionId(question);
        }
        if (QuestionStore.dataSource.length - QuestionStore.viewableItemIndex <= 5) {
            fetchData();
        }
    };

    const renderContent = (question: Question, index: number) => {
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

        const isAnswered = QuestionStore.answeredId.length > 0 && QuestionStore.answeredId.indexOf(question.id) != -1;
        // console.log(' QuestionStore.viewableItemIndex :', QuestionStore.viewableItemIndex, index);
        return (
            <View style={{ width: app.viewportWidth }}>
                <ScrollView
                    contentContainerStyle={styles.scrollStyle}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    scrollEnabled={!config.isFullScreen}
                    onScroll={onScroll}>
                    <View style={styles.content}>
                        <View style={[{ marginHorizontal: PxFit(Theme.itemSpace) }]}>
                            <UserInfo question={question} navigation={props.navigation} />
                            <QuestionBody question={question} audit={false} />
                        </View>
                        {question.video && question.video.url && (
                            <Player
                                style={{ marginTop: PxFit(Theme.itemSpace) }}
                                video={question.video}
                                isIntoView={index == QuestionStore.viewableItemIndex}
                                isVideoList={true}
                            />
                        )}

                        {// 防止拖动一半看下一题答案
                        QuestionStore.viewableItemIndex == index && (
                            <View style={{ marginHorizontal: PxFit(Theme.itemSpace), marginTop: PxFit(20) }}>
                                <QuestionOptions
                                    questionId={question.id}
                                    selections={question.selections_array}
                                    onSelectOption={selectOption}
                                    submited={submited}
                                    answer={question.answer}
                                    selectedOption={answer}
                                />
                            </View>
                        )}
                    </View>
                    {QuestionStore.viewableItemIndex == index && (
                        <View style={{ marginHorizontal: PxFit(Theme.itemSpace), zIndex: -1 }}>
                            <AnswerBar isShow={submited} question={question} navigation={props.navigation} />

                            {submited && <VideoExplain video={Helper.syncGetter('explanation.video', question)} />}
                            {submited && (
                                <Explain
                                    text={Helper.syncGetter('explanation.content', question)}
                                    picture={Helper.syncGetter('explanation.images.0.path', question)}
                                />
                            )}
                        </View>
                    )}
                </ScrollView>
                {!config.isFullScreen && (
                    <FooterBar
                        navigation={props.navigation}
                        question={question}
                        submited={submited}
                        answer={answer}
                        showComment={() => commentHandler(isAnswered)}
                        oSubmit={() => onSubmit(question)}
                        isAnswered={isAnswered}
                    />
                )}
            </View>
        );
    };

    if (!data) return null;
    return (
        <Fragment>
            <PageContainer
                title={'答题'}
                white
                autoKeyboardInsets={false}
                rightView={
                    <TouchFeedback style={styles.optionsButton} onPress={showOptions}>
                        <Iconfont name="more-vertical" color={Theme.defaultTextColor} size={PxFit(18)} />
                    </TouchFeedback>
                }
                hiddenNavBar={config.isFullScreen}
                onLayout={onContainerLayout}
                titleStyle={{ color: Theme.defaultTextColor }}
                navBarStyle={{
                    borderBottomWidth: 0,
                    borderBottomColor: '#fff',
                    backgroundColor: '#fff',
                }}
                backButtonColor={Theme.defaultTextColor}>
                {config.isFullScreen && <StatusBar translucent={true} hidden />}
                {!config.isFullScreen && <Banner isAnswer showWithdraw navigation={props.navigation} />}
                <FlatList
                    ref={flatListRef}
                    data={QuestionStore.dataSource}
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={false}
                    scrollsToTop={false}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={QuestionStore.viewableItemIndex}
                    keyboardShouldPersistTaps="always"
                    pagingEnabled={true}
                    removeClippedSubviews={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => renderContent(item, index)}
                    getItemLayout={(data, index) => ({
                        length: app.viewportWidth,
                        offset: app.viewportWidth * index,
                        index,
                    })}
                    onMomentumScrollBegin={() => onMomentumScrollBegin(data)}
                    onViewableItemsChanged={getVisibleRows}
                    viewabilityConfig={viewConfig.current}
                />
            </PageContainer>
            <CommentOverlay ref={commentRef} question={data} />
        </Fragment>
    );
});

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
        height: Device.HEIGTH,
        justifyContent: 'center',
        width: Device.WIDTH,
    },
    scrollStyle: {
        backgroundColor: '#fefefe',
        flexGrow: 1,
    },

    withdrawProgress: {
        bottom: PxFit(80) + Device.HOME_INDICATOR_HEIGHT,
        position: 'absolute',
        right: PxFit(20),
    },
});

export default AnswerScreen;
