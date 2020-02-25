import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { DeviceEventEmitter, StyleSheet, View, FlatList } from 'react-native';
import { Iconfont, PullChooser, TouchFeedback, PageContainer, StatusView } from '@src/components';
import { Theme, SCREEN_WIDTH, PxFit, Tools, ISIOS } from '@src/utils';
import { useApolloClient, useQuery, GQL } from '@src/apollo';
import { app, config } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';
import ChooseOverlay from './components/ChooseOverlay';
import AnswerPlaceholder from './components/AnswerPlaceholder';
import AnswerQuestion from './components/AnswerQuestion';
import { show } from './components/AnswerCardOverlay';
import { observer, QuestionsStore } from './store';
import CommentOverlay from '@src/screens/comment/CommentOverlay';

export default observer(() => {
    const client = useApolloClient();
    const navigation = useNavigation();
    const category = useMemo(() => navigation.getParam('category', {}), []);
    const viewableQuestionIndex = useMemo(() => navigation.getParam('viewableQuestionIndex', 0), [navigation]);
    const store = useMemo(() => new QuestionsStore(), []);
    const { questions, addQuestions, transcript, setTranscript } = store;
    const question = useMemo(() => questions[viewableQuestionIndex], [questions, viewableQuestionIndex]);
    const [error, setError] = useState(false);
    const [minLevel, setMinLevel] = useState(2);
    const listRef = useRef();
    const commentRef = useRef();
    const flag = useRef(false);

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

    const { data, error: errros } = useQuery(GQL.UserMeansQuery, {
        variables: { id: app.me.id },
    });

    console.log('errros :', errros);

    const user = useMemo(() => Tools.syncGetter('user', data), [data]);

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

            const questionsData = Tools.syncGetter('data.questions', result);

            if (Array.isArray(questionsData) && questionsData.length > 0) {
                addQuestions(questionsData);
            }
        } catch (error) {
            const str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
            setError(error);
        }
        flag.current = false;
    }, [client, category]);

    useEffect(() => {
        fetchQuestions();
        // 等级限制
        fetch(Config.ServerRoot + '/api/app/task/user-config?api_token=' + app.me.token)
            .then(response => response.json())
            .then(result => {
                setMinLevel(Tools.syncGetter('chuti.min_level', result));
            })
            .catch(err => {
                console.warn('加载task config err', err);
            });
    }, [fetchQuestions]);

    const scrollTo = (index: any) => {
        listRef.current && listRef.current.scrollToIndex({ animated: false, index });
    };

    useEffect(() => {
        console.log('进入');
        const selectAnswerListener = DeviceEventEmitter.addListener('selectAnswer', ({ order, result }) => {
            console.log('object :', store.viewableItemIndex, store.questions.length);
            setTranscript(order, result);
            if (store.viewableItemIndex + 1 === store.questions.length) {
                console.log('DeviceEventEmitter :', show);
                show({ transcript: store.transcript, category, store, navigation, scrollTo });
            }
        });
        DeviceEventEmitter.addListener('showComment', () => {
            showComment();
        });
        const turnThePageListener = DeviceEventEmitter.addListener('turnThePage', index => {
            if (index + 1 < store.questions.length) {
                listRef.current && listRef.current.scrollToIndex({ animated: true, index: ++index });
            }
        });
        DeviceEventEmitter.addListener('nextQuestion', index => {
            listRef.current && listRef.current.scrollToIndex({ animated: true, index: ++index });
        });
        return () => {
            selectAnswerListener.remove();
            turnThePageListener.remove();
            console.log('退出');
        };
    }, [showComment]);

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

    const getVisibleRows = useCallback(info => {
        if (info.viewableItems[0]) {
            store.viewableItemIndex = info.viewableItems[0].index;
        }
    }, []);

    const getItemLayout = useCallback((data, index) => {
        return {
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
        };
    }, []);

    const renderItem = useCallback(
        ({ item, index }) => {
            return (
                <AnswerQuestion key={item.id} order={index} questions={questions} question={item} category={category} />
            );
        },
        [transcript, questions],
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
                />
            </View>
        );
    }, [fetchQuestions, questions, error]);
    console.log('exam data :', store.transcript, store.viewableItemIndex);
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
    itemContainer: {
        flex: 1,
        width: SCREEN_WIDTH,
    },
});
