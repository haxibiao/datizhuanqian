import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TouchableOpacity } from 'react-native';
import { PageContainer, Row, Iconfont, beginnerGuidance, SetQuestionGuidance } from '@src/components';
import { Theme, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Tools, ISIOS } from '@src/utils';
import { useApolloClient, useMutation, GQL } from '@src/apollo';
import { storage, keys, app, config } from '@src/store';
import service from '@src/service';
import { ad } from '@src/native';
import { Overlay } from 'teaset';
import { useNavigation } from 'react-navigation-hooks';
import { Audit, AuditStatus, Explain, Information, Question } from '@src/question/component';
import { Placeholder, ChooseOverlay, AuditResultOverlay, AnswerBottom } from './components';
import { observer, useQuestionStore } from './store';
import CommentOverlay from '@src/comment/CommentOverlay';
import { syncGetter } from 'src/utils/Tools/adapter';

export default observer(props => {
    const client = useApolloClient();
    const navigation = useNavigation();
    const category = useMemo(() => navigation.getParam('category', {}), []);
    const store = useQuestionStore();
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
            const questions = Tools.syncGetter('questions', result.data);
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
    }, [client]);

    useEffect(() => {
        fetchQuestions();
        // 新手指导
        !config.disableAd &&
            beginnerGuidance({
                guidanceKey: 'Answer',
                GuidanceView: AnswerGuidance,
                dismissEnabled: true,
            });
        // 等级限制
        fetch(Config.ServerRoot + '/api/app/task/user-config?api_token=' + app.me.token)
            .then(response => response.json())
            .then(result => {
                setMinLevel(syncGetter('chuti.min_level', result));
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
            return <StatusView.ErrorView onPress={fetchData} error={error} />;
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
            <React.Fragment>
                {!config.isFullScreen && <Banner isAnswer showWithdraw navigation={navigation} />}
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollStyle,
                        {
                            paddingBottom: isAudit ? SCREEN_WIDTH / 3 : 0,
                        },
                    ]}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    scrollEnabled={!config.isFullScreen}>
                    <View style={styles.content}>
                        <Question />
                        <Information />
                        <AuditStatus />
                        <Explain />
                    </View>
                    <Audit />
                </ScrollView>
                <AnswerBottom />
            </React.Fragment>
        );
    }, [fetchData, question, finished, error, isAudit, navigation]);

    return (
        <React.Fragment>
            <PageContainer
                title={category.name || '答题'}
                white
                autoKeyboardInsets={false}
                onWillBlur={this.hideComment}
                rightView={
                    question && (
                        <TouchFeedback
                            disabled={!this.state.question}
                            style={styles.optionsButton}
                            onPress={this.showOptions}>
                            <Iconfont name="more-vertical" color="#000" size={PxFit(18)} />
                        </TouchFeedback>
                    )
                }
                hiddenNavBar={config.isFullScreen}
                onLayout={this.onContainerLayout}
                titleStyle={{ color: Theme.defaultTextColor }}
                navBarStyle={{
                    borderBottomWidth: 0,
                    borderBottomColor: '#fff',
                    backgroundColor: '#fff',
                }}
                backButtonColor={Theme.defaultTextColor}>
                {config.isFullScreen && <StatusBar translucent={true} hidden />}
                <View style={styles.container}>{content}</View>
            </PageContainer>
            <CommentOverlay ref={commentRef} question={this.state.question} />
        </React.Fragment>
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    saveButton: {
        flex: 1,
        justifyContent: 'center',
    },
    saveText: {
        fontSize: PxFit(15),
        textAlign: 'center',
        color: Theme.primaryColor,
    },
    topicItem: {
        flexDirection: 'row',
        paddingHorizontal: PxFit(15),
        paddingVertical: PxFit(12),
        justifyContent: 'space-between',
        borderBottomWidth: PxFit(1),
        borderBottomColor: '#F1EFFA',
    },
    iconTopic: {
        width: PxFit(22),
        height: PxFit(22),
        marginRight: PxFit(4),
        resizeMode: 'cover',
    },
    topicText: {
        color: '#149EFF',
        fontSize: PxFit(16),
    },
    contentWrap: {
        margin: PxFit(15),
    },
    selectionsWrap: {
        marginLeft: PxFit(15),
    },
    explainWrap: {
        marginHorizontal: PxFit(15),
    },
    contentInput: {
        height: PxFit(120),
        padding: PxFit(10),
        paddingTop: PxFit(10),
        fontSize: PxFit(14),
        lineHeight: PxFit(20),
        borderRadius: PxFit(5),
        backgroundColor: '#f4f4f4',
    },
    audioContainer: {
        marginTop: PxFit(15),
        width: PxFit(160),
        height: PxFit(36),
        paddingHorizontal: PxFit(14),
        borderRadius: PxFit(18),
    },
});
