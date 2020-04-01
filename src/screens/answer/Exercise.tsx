import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { DeviceEventEmitter, StyleSheet, View, Text } from 'react-native';
import { Iconfont, PullChooser, TouchFeedback, PageContainer, StatusView, Banner } from '@src/components';
import { Theme, PxFit, ISIOS } from '@src/utils';
import { useApolloClient, useQuery, GQL } from '@src/apollo';
import { app, config } from '@src/store';
import { ad } from '@app/native';
import { Overlay } from 'teaset';
import { useNavigation } from 'react-navigation-hooks';
import ChooseOverlay from './components/ChooseOverlay';
import AnswerPlaceholder from './components/AnswerPlaceholder';
import AnswerQuestion from './components/AnswerQuestion';
import FirstWithdrawTips from './components/FirstWithdrawTips';
import AnswerResult from './components/AnswerResult';
import { observer } from './store';
import CommentOverlay from '@src/screens/comment/CommentOverlay';

export default observer(() => {
    const client = useApolloClient();
    const navigation = useNavigation();
    const category = useMemo(() => navigation.getParam('category', {}), []);
    const questions = useRef([]);
    const [question, setQuestion] = useState(null);
    const [finished, setFinished] = useState(false);
    const [error, setError] = useState(false);
    const [minLevel, setMinLevel] = useState(2);
    const commentRef = useRef();
    const flag = useRef(false);
    const advertisingInterval = useMemo(() => (config.disableAd ? 100 : 5), []);
    const answerCount = useRef({ count: 0, error: 0 });

    const showComment = useCallback(() => {
        commentRef.current.slideUp();
    }, [commentRef]);

    const hideComment = useCallback(() => {
        commentRef.current.slideDown();
    }, [commentRef]);

    const { data } = useQuery(GQL.UserMeansQuery, {
        variables: { variables: { id: app.me.id } },
    });

    const user = useMemo(() => Helper.syncGetter('user', data), [data]);

    // 加载广告缓存
    const loadAd = useCallback(() => {
        if (user && !ISIOS && config.enableQuestion) {
            ad.FullScreenVideo.loadFullScreenVideoAd().then(() => {});
            ad.RewardVideo.loadAd().then(() => {});
        }
    }, [user]);

    const fetchQuestions = useCallback(async () => {
        if (flag.current) {
            return;
        }
        flag.current = true;
        try {
            const result = await client.query({
                query: GQL.QuestionListQuery,
                variables: { category_id: category.id, limit: 10 },
                fetchPolicy: 'network-only',
            });

            const resource = Helper.syncGetter('data.questions', result);

            if (Array.isArray(resource) && resource.length > 0) {
                questions.current = resource;
                nextQuestion();
            } else {
                setFinished(true);
            }
        } catch (error) {
            const str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
            setError(error);
        }
        flag.current = false;
    }, [client, category]);

    const nextQuestion = useCallback(() => {
        if (questions.current.length > 0) {
            setQuestion(questions.current.shift());
        } else {
            setQuestion(null);
            fetchQuestions();
        }
    }, [questions, fetchQuestions]);

    const showOptions = useCallback(() => {
        if (ISIOS) {
            PullChooser.show([
                {
                    title: '举报',
                    onPress: () => navigation.navigate('ReportQuestion', { question }),
                },
                {
                    title: '分享',
                    onPress: () => navigation.navigate('ShareCard', { question }),
                },
            ]);
        } else {
            ChooseOverlay.show(question, navigation, category, minLevel, user);
        }
    }, [user, navigation, question, category, minLevel]);

    // 广告触发, iOS不让苹果审核轻易发现答题触发广告，设置多一点，比如答题100个
    // 安卓提高到5个题计算及格和视频奖励
    const showAnswerResult = useCallback(() => {
        if (answerCount.current.count === advertisingInterval) {
            let overlayViewRef;
            const overlayView = (
                <Overlay.View animated modal ref={ref => (overlayViewRef = ref)}>
                    <View style={styles.overlayInner}>
                        <AnswerResult
                            hide={() => overlayViewRef.close()}
                            navigation={navigation}
                            answer_count={answerCount.current.count}
                            error_count={answerCount.current.error}
                        />
                    </View>
                </Overlay.View>
            );
            Overlay.show(overlayView);
            answerCount.current = { count: 0, error: 0 };
        }
    }, [navigation]);

    useEffect(() => {
        fetchQuestions();
        // 等级限制
        fetch(Config.ApiServceRoot + '/api/app/task/user-config?api_token=' + app.me.token)
            .then(response => response.json())
            .then(result => {
                setMinLevel(Helper.syncGetter('chuti.min_level', result));
            })
            .catch(err => {
                console.warn('加载task config err', err);
            });
        // 加载广告
        loadAd();
    }, [fetchQuestions]);
    // 处理答题、下一页、显示评论等事件
    useEffect(() => {
        const nextQuestionListener = DeviceEventEmitter.addListener('nextQuestion', () => {
            console.log('nextQuestion :');
            nextQuestion();
        });
        const answerQuestionListener = DeviceEventEmitter.addListener('answerQuestion', isError => {
            answerCount.current.count++;
            isError == 'error' && answerCount.current.error++;
            if (!config.disableAd) {
                showAnswerResult();
            }
        });
        const showCommentListener = DeviceEventEmitter.addListener('showComment', () => {
            showComment();
        });
        return () => {
            answerQuestionListener.remove();
            showCommentListener.remove();
            nextQuestionListener.remove();
        };
    }, [nextQuestion, showComment]);
    // 页面UI
    const content = useMemo(() => {
        if (error) {
            return <StatusView.ErrorView onPress={fetchQuestions} error={error} />;
        } else if (!question && !finished) {
            return <AnswerPlaceholder answer />;
        } else if (!question) {
            return (
                <StatusView.EmptyView
                    titleStyle={{ textAlign: 'center', fontSize: PxFit(13), lineHeight: PxFit(18) }}
                    title={`暂时没有题目了，试试去出题吧！\n或先去其它分类下答题吧~`}
                />
            );
        }
        return <AnswerQuestion key={question.id} question={question} category={category} />;
    }, [fetchQuestions, question, finished, error]);

    return (
        <React.Fragment>
            <PageContainer
                title={category.name || '答题'}
                white
                autoKeyboardInsets={false}
                onWillBlur={hideComment}
                rightView={
                    question && (
                        <TouchFeedback disabled={!question} style={styles.optionsButton} onPress={showOptions}>
                            <Iconfont name="more-vertical" color="#000" size={PxFit(18)} />
                        </TouchFeedback>
                    )
                }
                hiddenNavBar={config.isFullScreen}
                titleStyle={{ color: Theme.defaultTextColor }}
                navBarStyle={{
                    borderBottomWidth: PxFit(1),
                    borderBottomColor: '#f0f0f0',
                    backgroundColor: '#fff',
                }}
                navBarStyle={{
                    borderBottomWidth: 0,
                    borderBottomColor: '#fff',
                    backgroundColor: '#fff',
                }}
                backButtonColor={Theme.defaultTextColor}>
                {config.isFullScreen && <StatusBar translucent={true} hidden />}
                {!config.isFullScreen && <Banner isAnswer showWithdraw navigation={navigation} />}
                {content}
            </PageContainer>
            <CommentOverlay ref={commentRef} question={question} />
        </React.Fragment>
    );
});

const styles = StyleSheet.create({
    optionsButton: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        width: PxFit(40),
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        paddingVertical: PxFit(15),
        paddingHorizontal: PxFit(12),
    },
    overlayInner: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
