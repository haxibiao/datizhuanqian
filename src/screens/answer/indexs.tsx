import React, { useRef, useState, useMemo, useCallback, useEffect, createContext } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TouchableOpacity } from 'react-native';
import {
    Row,
    Banner,
    Iconfont,
    PullChooser,
    TouchFeedback,
    PageContainer,
    beginnerGuidance,
    SetQuestionGuidance,
} from '@src/components';
import { Theme, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Tools, ISIOS } from '@src/utils';
import { useApolloClient, useMutation, useQuery, GQL } from '@src/apollo';
import { storage, keys, app, config } from '@src/store';
import service from '@src/service';
import { ad } from '@app/native';
import { Overlay } from 'teaset';
import { useNavigation } from 'react-navigation-hooks';
import { Audit, AuditStatus, Explain, Information, Question } from '@src/screens/question/component';
import Placeholder from './components/Placeholder';
import ChooseOverlay from './components/ChooseOverlay';
import AnswerBottom from './components/AnswerBottom';
import AnswerPlaceholder from './components/AnswerPlaceholder';
import { observer, QuestionStore } from './store';
import CommentOverlay from '@src/screens/comment/CommentOverlay';

export default observer(props => {
    const client = useApolloClient();
    const store = useRef(new QuestionStore()).current;
    const navigation = useNavigation();
    const category = useMemo(() => navigation.getParam('category', {}), []);
    const { setQuestions, question, isAudit, submitted } = store;
    const [finished, setFinished] = useState(false);
    const [error, setError] = useState(false);
    const [minLevel, setMinLevel] = useState(2);
    const commentRef = useRef();

    const showComment = useCallback(() => {
        if (!isAudit && !submitted) {
            Toast.show({ content: '答完此题再评论哦', layout: 'bottom' });
        } else {
            commentRef.current.slideUp();
        }
    }, [isAudit, submitted, commentRef]);

    const hideComment = useCallback(() => {
        commentRef.current.slideDown();
    }, [commentRef]);

    const { data: user } = useQuery(GQL.UserMeansQuery, {
        variables: { variables: { id: app.me.id } },
    });

    const fetchQuestions = useCallback(async () => {
        try {
            const result = await client.query({
                query: GQL.QuestionListQuery,
                variables: { category_id: category.id, limit: 10 },
                fetchPolicy: 'network-only',
            });

            const questions = Tools.syncGetter('data.questions', result);

            if (Array.isArray(questions) && questions.length > 0) {
                setQuestions(questions);
            } else {
                setFinished(true);
            }
        } catch (error) {
            const str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
            setError(error);
        }
    }, [store, client, category]);

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
    }, [loadAd]);

    const showOptions = useCallback(() => {
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
            : ChooseOverlay.show(question, navigation, category, minLevel, user);
    }, [user, navigation, question, category]);

    // 加载广告缓存
    const loadAd = useCallback(() => {
        if (user && !ISIOS && config.enableQuestion) {
            ad.FullScreenVideo.loadFullScreenVideoAd().then(result => {});
            ad.RewardVideo.loadAd().then(result => {});
        }
    }, [user]);

    const content = useMemo(() => {
        if (error) {
            return <StatusView.ErrorView onPress={fetchQuestions} error={error} />;
        } else if (!question && finished) {
            return (
                <StatusView.EmptyView
                    titleStyle={{ textAlign: 'center', fontSize: PxFit(13), lineHeight: PxFit(18) }}
                    title={`暂时没有题目了，试试去出题吧！\n或先去其它分类下答题吧~`}
                />
            );
        } else if (!question) {
            return <AnswerPlaceholder answer />;
        }

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        {
                            paddingBottom: isAudit ? SCREEN_WIDTH / 3 : 0,
                        },
                    ]}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    scrollEnabled={!config.isFullScreen}>
                    <View style={styles.content} key={question.id}>
                        <Question question={question} store={store} />
                        {submitted && <Information question={question} />}
                        {isAudit && <AuditStatus question={question} store={store} />}
                    </View>
                    {isAudit && <Audit question={question} store={store} key={question.id} />}
                </ScrollView>
                <AnswerBottom
                    key={question.id}
                    showComment={showComment}
                    question={question}
                    user={user}
                    store={store}
                />
            </View>
        );
    });
    // [submitted, fetchQuestions, question, finished, error, isAudit, navigation, user]

    return (
        <React.Fragment>
            <PageContainer
                title={category.name || '答题'}
                white
                autoKeyboardInsets={false}
                // onWillBlur={hideComment}
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
        backgroundColor: '#fff',
    },
    optionsButton: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center',
        width: PxFit(40),
    },
    scrollContent: {
        backgroundColor: '#fefefe',
        flexGrow: 1,
    },
    content: {
        paddingVertical: PxFit(15),
        paddingHorizontal: PxFit(12),
    },
});
