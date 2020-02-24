import React, { useRef, useState, useMemo, useCallback, useEffect, createContext } from 'react';
import {
    DeviceEventEmitter,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {
    Row,
    Banner,
    Iconfont,
    PullChooser,
    TouchFeedback,
    PageContainer,
    beginnerGuidance,
    SetQuestionGuidance,
    StatusView,
} from '@src/components';
import { Theme, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Tools, ISIOS } from '@src/utils';
import { useApolloClient, useMutation, useQuery, GQL } from '@src/apollo';
import { storage, keys, app, config } from '@src/store';
import { ad } from '@app/native';
import { useNavigation } from 'react-navigation-hooks';
import { Audit, AuditStatus, Explain, Information, Question } from '@src/screens/question/component';
import Placeholder from './components/Placeholder';
import ChooseOverlay from './components/ChooseOverlay';
import AnswerPlaceholder from './components/AnswerPlaceholder';
import AnswerQuestion from './components/AnswerQuestion';
import { AnswerCard } from './components/AnswerCardOverlay';
import { observer, QuestionsStore } from './store';
import CommentOverlay from '@src/screens/comment/CommentOverlay';

export default observer(props => {
    const client = useApolloClient();
    const navigation = useNavigation();
    const category = useMemo(() => navigation.getParam('category', {}), []);
    const viewableQuestionIndex = useMemo(() => navigation.getParam('viewableQuestionIndex', 0), [navigation]);
    const store = useMemo(() => new QuestionsStore(), []);
    const { questions, addQuestions, transcript, setTranscript } = store;
    const question = useMemo(() => questions[store.viewableItemIndex], [questions]);
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

    const { data } = useQuery(GQL.UserMeansQuery, {
        variables: { variables: { id: app.me.id } },
    });

    const user = useMemo(() => Tools.syncGetter('user', data), [data]);

    // 加载广告缓存
    const loadAd = useCallback(() => {
        if (user && !ISIOS && config.enableQuestion) {
            ad.FullScreenVideo.loadFullScreenVideoAd().then(result => {});
            ad.RewardVideo.loadAd().then(result => {});
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
        // 加载广告
        loadAd();
    }, [fetchQuestions]);

    useEffect(() => {
        DeviceEventEmitter.addListener('selectAnswer', ({ order, result }) => {
            setTranscript(order, result);
        });
        DeviceEventEmitter.addListener('showComment', () => {
            showComment();
        });
        DeviceEventEmitter.addListener('turnThePage', index => {
            listRef.current && listRef.current.scrollToIndex({ animated: true, index: ++index });
        });
        DeviceEventEmitter.addListener('nextQuestion', index => {
            listRef.current && listRef.current.scrollToIndex({ animated: true, index: ++index });
        });
        return () => {
            DeviceEventEmitter.removeListener('selectAnswer');
            DeviceEventEmitter.removeListener('showComment');
            DeviceEventEmitter.removeListener('turnThePage');
            DeviceEventEmitter.removeListener('nextQuestion');
        };
    }, [setTranscript, showComment]);

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
            if (item.name === 'submit') {
                return (
                    <View style={styles.itemContainer}>
                        <AnswerCard transcript={transcript} category={category} />
                    </View>
                );
            }
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
                    data={[...questions, { name: 'submit' }]}
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
