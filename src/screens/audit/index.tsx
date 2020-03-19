import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { DeviceEventEmitter, StyleSheet } from 'react-native';
import { Iconfont, PullChooser, TouchFeedback, PageContainer, StatusView } from '@src/components';
import { useApolloClient, useQuery, GQL } from '@src/apollo';
import { app, config, observer } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';

import AnswerPlaceholder from '@src/screens/answer/components/AnswerPlaceholder';
import AuditQuestion from './components/AuditQuestion';

// import { observer } from './store';
import CommentOverlay from '@src/screens/comment/CommentOverlay';

export default observer(() => {
    const client = useApolloClient();
    const navigation = useNavigation();
    const category = useMemo(() => navigation.getParam('category', {}), []);
    const questions = useRef([]);
    const [question, setQuestion] = useState(null);
    const [finished, setFinished] = useState(false);
    const [error, setError] = useState(false);
    const [] = useState(2);
    const commentRef = useRef();
    const flag = useRef(false);
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

    const fetchQuestions = useCallback(async () => {
        if (flag.current) {
            return;
        }
        flag.current = true;
        try {
            const result = await client.query({
                query: GQL.QuestionListQuery,
                variables: { category_id: 10, limit: 10 },
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
    }, [navigation, question]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);
    // 处理答题、下一页、显示评论等事件
    useEffect(() => {
        DeviceEventEmitter.addListener('nextQuestion', () => {
            nextQuestion();
        });
        DeviceEventEmitter.addListener('answerQuestion', isError => {
            answerCount.current.count++;
            isError && answerCount.current.error++;
        });
        DeviceEventEmitter.addListener('showComment', () => {
            showComment();
        });
        return () => {
            DeviceEventEmitter.removeListener('nextQuestion');
            DeviceEventEmitter.removeListener('answerQuestion');
            DeviceEventEmitter.removeListener('showComment');
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
        return <AuditQuestion key={question.id} question={question} />;
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
                backButtonColor={Theme.defaultTextColor}>
                {config.isFullScreen && <StatusBar translucent={true} hidden />}
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
