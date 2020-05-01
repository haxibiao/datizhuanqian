import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { DeviceEventEmitter, StyleSheet, View, FlatList, BackHandler } from 'react-native';
import {
    Iconfont,
    PullChooser,
    TouchFeedback,
    PageContainer,
    StatusView,
    beginnerGuidance,
    ExamGuidance,
    Row,
} from '@src/components';
import { useApolloClient, useQuery, GQL } from '@src/apollo';
import { app, config } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';
import ChooseOverlay from './components/ChooseOverlay';
import AnswerPlaceholder from './components/AnswerPlaceholder';
import AnswerQuestion from './components/AnswerQuestion';
import AnswerCardOverlay from './components/AnswerCardOverlay';
import { observer, QuestionsStore } from './store';
import CommentOverlay from '@src/screens/comment/CommentOverlay';
import LeaveExam from './components/LeaveExam';

export default observer(() => {
    const client = useApolloClient();
    const navigation = useNavigation();
    const category = useMemo(() => navigation.getParam('category', {}), []);
    const examData = useMemo(() => navigation.getParam('questions'), []);
    const viewableQuestionIndex = useMemo(() => navigation.getParam('viewableQuestionIndex', 0), [navigation]);
    const store = useMemo(() => new QuestionsStore(examData), [examData]);
    const { questions, addQuestions } = store;
    const question = useMemo(() => questions[viewableQuestionIndex], [questions, viewableQuestionIndex]);
    const [error, setError] = useState(false);
    const [minLevel, setMinLevel] = useState(2);
    const listRef = useRef();
    const commentRef = useRef();
    const flag = useRef(false);
    const viewabilityConfig = useRef({
        // waitForInteraction: true,
        viewAreaCoveragePercentThreshold: 95,
    });

    useEffect(() => {
        if (viewableQuestionIndex !== store.viewableItemIndex) {
            listRef.current && listRef.current.scrollToIndex({ animated: true, index: viewableQuestionIndex });
        }
    }, [viewableQuestionIndex]);

    const showComment = useCallback(() => {
        commentRef.current.slideUp();
    }, [commentRef]);

    const hideComment = useCallback(() => {
        commentRef.current.slideDown();
    }, [commentRef]);

    const showExamCard = useCallback(() => {
        if (store.viewableItemIndex === store.questions.length - 1) {
            AnswerCardOverlay.show({ questions: store.questions, category, store, navigation, scrollTo });
        }
    }, []);

    const { data, error: errros } = useQuery(GQL.UserMeansQuery, {
        variables: { id: app.me.id },
    });

    const user = useMemo(() => Helper.syncGetter('user', data), [data]);

    const fetchQuestions = useCallback(async () => {
        if (flag.current || examData) {
            return;
        }
        flag.current = true;
        try {
            const result = await client.query({
                query: GQL.QuestionListQuery,
                variables: { category_id: category.id, limit: 10 },
                fetchPolicy: 'network-only',
            });
            console.log('result :', result);
            const questionsData = Helper.syncGetter('data.questions', result);

            if (Array.isArray(questionsData) && questionsData.length > 0) {
                addQuestions(questionsData);
            }
        } catch (error) {
            const str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
            setError(error);
        }
        flag.current = false;
    }, [client, category, examData]);

    useEffect(() => {
        fetchQuestions();
        // 等级限制
        fetch(Config.ServerRoot + '/api/app/task/user-config?api_token=' + app.me.token)
            .then(response => response.json())
            .then(result => {
                setMinLevel(Helper.syncGetter('chuti.min_level', result));
            })
            .catch(err => {
                console.warn('加载task config err', err);
            });
    }, []);

    const scrollTo = (index: any) => {
        listRef.current && listRef.current.scrollToIndex({ animated: false, index });
    };

    useEffect(() => {
        const selectAnswerListener = DeviceEventEmitter.addListener('selectAnswer', () => {
            showExamCard();
        });

        const showCommentListener = DeviceEventEmitter.addListener('showComment', () => {
            showComment();
        });

        const nextQuestionListener = DeviceEventEmitter.addListener('nextQuestion', () => {
            console.log('下一题 :');

            if (store.viewableItemIndex < store.questions.length - 1) {
                listRef.current &&
                    listRef.current.scrollToIndex({ animated: true, index: store.viewableItemIndex + 1 });
            }
        });

        beginnerGuidance({
            guidanceKey: 'Exam',
            GuidanceView: ExamGuidance,
            dismissEnabled: true,
        });

        const hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', () => {
            console.log('退出');
            if (!examData) {
                LeaveExam.show(navigation, category, store.questions);
                return true;
            }
        });

        return () => {
            selectAnswerListener.remove();
            showCommentListener.remove();
            nextQuestionListener.remove();
            hardwareBackPressListener.remove();
        };
    }, [store, showComment]);

    const showOptions = useCallback(() => {
        if (Device.IOS) {
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

    const getVisibleRows = useCallback(info => {
        if (info.viewableItems[0]) {
            store.viewableItemIndex = info.viewableItems[0].index;
        }
    }, []);

    const getItemLayout = useCallback((data, index) => {
        return {
            length: Device.WIDTH,
            offset: Device.WIDTH * index,
            index,
        };
    }, []);

    const renderItem = useCallback(
        ({ item, index }) => {
            return (
                <AnswerQuestion key={item.id} order={index} questions={questions} question={item} category={category} />
            );
        },
        [questions],
    );

    const content = useMemo(() => {
        if (error) {
            return <StatusView.ErrorView onPress={fetchQuestions} error={error} />;
        } else if (questions.length < 1) {
            return <AnswerPlaceholder answer />;
        }
        return (
            <View style={styles.container}>
                <FlatList
                    ref={listRef}
                    data={questions}
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={false}
                    scrollsToTop={false}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={store.viewableItemIndex}
                    onViewableItemsChanged={getVisibleRows}
                    getItemLayout={getItemLayout}
                    keyboardShouldPersistTaps="always"
                    pagingEnabled={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    viewabilityConfig={viewabilityConfig.current}
                />
            </View>
        );
    }, [fetchQuestions, questions, error]);

    return (
        <React.Fragment>
            <PageContainer
                title={category.name || '答题'}
                white
                autoKeyboardInsets={false}
                onWillBlur={hideComment}
                leftView={
                    <TouchFeedback
                        onPress={() => {
                            if (!examData) {
                                LeaveExam.show(navigation, category, store.questions);
                                return true;
                            }
                        }}
                        style={{
                            flex: 1,
                            width: Device.statusBarHeight,
                            justifyContent: 'center',
                        }}>
                        <Iconfont name="left" size={PxFit(21)} />
                    </TouchFeedback>
                }
                rightView={
                    question && (
                        <Row style={styles.optionsButton}>
                            <TouchFeedback
                                onPress={() =>
                                    AnswerCardOverlay.show({
                                        questions: store.questions,
                                        category,
                                        store,
                                        navigation,
                                        scrollTo,
                                    })
                                }>
                                <Iconfont name={'order'} size={20} style={{ marginRight: 15 }} />
                            </TouchFeedback>
                            <TouchFeedback disabled={!question} onPress={showOptions}>
                                <Iconfont name="more-vertical" color="#000" size={PxFit(18)} />
                            </TouchFeedback>
                        </Row>
                    )
                }
                hiddenNavBar={config.isFullScreen}
                titleStyle={{ color: Theme.defaultTextColor }}
                navBarStyle={{
                    borderBottomWidth: PxFit(1),
                    borderBottomColor: '#f0f0f0',
                    backgroundColor: '#fff',
                }}
                backButtonColor={Theme.defaultTextColor}>
                {config.isFullScreen && <StatusBar translucent={true} hidden />}
                {content}
            </PageContainer>
            <CommentOverlay ref={commentRef} question={question} />
        </React.Fragment>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    optionsButton: {
        alignItems: 'center',
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
    itemContainer: {
        flex: 1,
        width: Device.WIDTH,
    },
});
