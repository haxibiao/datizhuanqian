/*
 * @flow
 * created by wyk made in 2019-03-25 10:52:46
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Animated, StatusBar } from 'react-native';
import { PageContainer, TouchFeedback, PopOverlay, Iconfont, PullChooser, StatusView, Player, Audio } from 'components';

import QuestionOptions from './components/QuestionOptions';
import UserInfo from './components/UserInfo';
import QuestionBody from './components/QuestionBody';
import AnswerBar from './components/AnswerBar';
import Explain from './components/Explain';
import VideoExplain from './components/VideoExplain';
import AuditUsers from './components/AuditUsers';
import CommentOverlay from '../comment/CommentOverlay';
import FooterBar from './components/FooterBar';
import AnswerPlaceholder from '../answer/components/AnswerPlaceholder';
import ChooseOverlay from '../answer/components/ChooseOverlay';

import { compose, graphql, GQL } from 'apollo';
import { observer, app, config } from 'store';

@observer
class index extends Component {
    constructor(props) {
        super(props);
        this._animated = new Animated.Value(0);
        this.state = {
            submitting: false,
            min_level: 2,
        };
    }

    componentDidMount() {
        Animated.timing(this._animated, {
            toValue: 1,
            duration: 400,
        }).start();
    }

    showComment = () => {
        this._commentOverlay && this._commentOverlay.slideUp();
    };

    hideComment = () => {
        this._commentOverlay && this._commentOverlay.slideDown();
    };

    deleteQuestion = async () => {
        let { navigation, deleteQuestionMutation } = this.props;
        this.setState({
            submitting: true,
        });
        try {
            await deleteQuestionMutation({
                variables: {
                    id: this.question.id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.mySubmitQuestionHistoryQuery,
                        fetchPolicy: 'network-only',
                    },
                ],
            });
            this.setState({
                submitting: false,
            });
            Toast.show({
                content: '删除成功',
            });
            navigation.goBack();
        } catch (error) {
            this.setState({
                submitting: false,
            });
            let str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({
                content: '删除失败，' + str,
            });
        }
    };

    removeQuestion = async () => {
        let { navigation, removeQuestionMutation } = this.props;
        this.setState({
            submitting: true,
        });
        try {
            await removeQuestionMutation({
                variables: {
                    id: this.question.id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.mySubmitQuestionHistoryQuery,
                        fetchPolicy: 'network-only',
                    },
                ],
            });
            this.setState({
                submitting: false,
            });
            Toast.show({
                content: '撤回成功',
            });
            navigation.goBack();
        } catch (error) {
            this.setState({
                submitting: false,
            });
            let str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({
                content: '撤回失败，' + str,
            });
        }
    };

    onPublish = async () => {
        let { navigation, publishQuestion } = this.props;
        this.setState({
            submitting: true,
        });
        try {
            await publishQuestion({
                variables: {
                    id: this.question.id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.mySubmitQuestionHistoryQuery,
                        fetchPolicy: 'network-only',
                    },
                ],
            });
            this.setState({
                submitting: false,
            });
            Toast.show({
                content: '发布成功',
            });
            navigation.goBack();
        } catch (error) {
            this.setState({
                submitting: false,
            });
            let str = error.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({
                content: '发布失败，' + str,
            });
        }
    };

    onRemove = () => {
        if (String(this.question.status) === '1') {
            PopOverlay({
                content: '撤回后将会扣除该题所得贡献,确定撤回吗？',
                onConfirm: this.removeQuestion,
            });
        } else {
            this.removeQuestion();
        }
    };

    onDelete = () => {
        PopOverlay({
            content: '确定删除该题目吗？',
            onConfirm: this.deleteQuestion,
        });
    };

    showOptions = () => {
        let { navigation, data } = this.props;
        let strategy = {
            master: {
                '-3': [
                    {
                        title: '发布',
                        onPress: this.onPublish,
                    },
                    {
                        title: '删除',
                        onPress: this.onDelete,
                    },
                ],
                '-2': [
                    {
                        title: '删除',
                        onPress: this.onDelete,
                    },
                ],
                '-1': [
                    {
                        title: '删除',
                        onPress: this.onDelete,
                    },
                ],
                '0': [
                    {
                        title: '撤回',
                        onPress: this.onRemove,
                    },
                ],
                '1': [
                    {
                        title: '撤回',
                        onPress: this.onRemove,
                    },
                ],
            },
            visitor: [
                {
                    title: '举报',
                    onPress: () =>
                        navigation.navigate('Report', {
                            question: this.question,
                        }),
                },
            ],
        };
        // let chooser = this.isOwn ? strategy['master'][String(this.question.status)] : strategy['visitor'];
        // PullChooser.show(chooser);
        this.isOwn || Device.IOS
            ? PullChooser.show(strategy['master'][String(this.question.status)])
            : ChooseOverlay.show(this.question, navigation, this.question.category, this.state.min_level, data.user);
    };

    render() {
        let { submitting } = this.state;
        let { navigation, questionQuery } = this.props;
        let referrer = navigation.getParam('referrer', null);
        const bodyStyle = {
            opacity: this._animated,
            transform: [
                {
                    translateY: this._animated.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-Device.WIDTH, 0],
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
        this.question = Helper.syncGetter('question', questionQuery);
        if (!this.question) {
            return (
                <PageContainer title="题目详情" white>
                    <AnswerPlaceholder />
                </PageContainer>
            );
        }
        let { id, selections_array, answer, status, user, explanation, video, audio } = this.question;

        this.isOwn = user.id === app.me.id;
        return (
            <React.Fragment>
                <PageContainer
                    white
                    title="题目详情"
                    submitting={submitting}
                    submitTips="loading..."
                    onWillBlur={this.hideComment}
                    error={questionQuery.error}
                    refetch={questionQuery.refetch}
                    rightView={
                        status == 1 || this.isOwn ? (
                            <TouchFeedback style={styles.optionsButton} onPress={this.showOptions}>
                                <Iconfont name="more-horizontal" color="#000" size={PxFit(18)} />
                            </TouchFeedback>
                        ) : null
                    }
                    hiddenNavBar={config.isFullScreen}>
                    {config.isFullScreen && <StatusBar translucent={true} hidden />}
                    {status == 1 || this.isOwn ? (
                        <View
                            style={{
                                flex: 1,
                            }}>
                            <ScrollView
                                contentContainerStyle={styles.scrollStyle}
                                keyboardShouldPersistTaps="always"
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                                scrollEnabled={!config.isFullScreen}>
                                <View style={styles.content}>
                                    <Animated.View style={[{ marginHorizontal: PxFit(Theme.itemSpace) }, bodyStyle]}>
                                        <UserInfo question={this.question} navigation={navigation} />
                                        <QuestionBody question={this.question} />
                                    </Animated.View>
                                    {video && video.url && (
                                        <Player style={{ marginTop: PxFit(Theme.itemSpace) }} video={video} />
                                    )}
                                    {audio && audio.url && <Audio.Player style={styles.audioContainer} audio={audio} />}
                                    <View
                                        style={{
                                            marginHorizontal: PxFit(Theme.itemSpace),
                                            marginTop: PxFit(20),
                                        }}>
                                        <QuestionOptions
                                            questionId={id}
                                            selections={selections_array}
                                            onSelectOption={this.selectOption}
                                            submited
                                            answer={referrer === 'user' && !this.isOwn ? null : answer}
                                        />
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: PxFit(Theme.itemSpace), zIndex: -1 }}>
                                    <AnswerBar
                                        isShow={referrer !== 'user' && !this.isOwn}
                                        question={this.question}
                                        navigation={navigation}
                                    />
                                    <VideoExplain video={Helper.syncGetter('video', explanation)} />
                                    <Explain
                                        text={Helper.syncGetter('content', explanation)}
                                        picture={Helper.syncGetter('images.0.path', explanation)}
                                    />
                                    <AuditUsers
                                        question={this.question}
                                        navigation={navigation}
                                        isCreator={this.isOwn}
                                    />
                                </View>
                            </ScrollView>
                            {!config.isFullScreen && (
                                <Animated.View style={footerStyle}>
                                    <FooterBar
                                        navigation={navigation}
                                        question={this.question}
                                        showComment={this.showComment}
                                        oSubmit={this.onSubmit}
                                        isOwn={this.isOwn}
                                    />
                                </Animated.View>
                            )}
                        </View>
                    ) : (
                        <StatusView.EmptyView title="题目不存在或已下架" />
                    )}
                </PageContainer>
                <CommentOverlay ref={ref => (this._commentOverlay = ref)} question={this.question} />
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    scrollStyle: {
        flexGrow: 1,
        backgroundColor: '#fefefe',
    },
    content: {
        paddingTop: PxFit(20),
        marginBottom: PxFit(Theme.itemSpace),
    },
    audioContainer: {
        marginTop: PxFit(Theme.itemSpace),
        marginHorizontal: PxFit(Theme.itemSpace),
        width: PxFit(160),
        height: PxFit(36),
        paddingHorizontal: PxFit(14),
        borderRadius: PxFit(18),
    },
    optionsButton: {
        flex: 1,
        width: PxFit(40),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    optionsText: {
        fontSize: PxFit(15),
        textAlign: 'center',
        color: Theme.secondaryColor,
    },
    answerText: {
        fontSize: PxFit(15),
        color: Theme.defaultTextColor,
        marginBottom: PxFit(5),
    },
    curationText: {
        fontSize: PxFit(13),
        color: Theme.subTextColor,
    },
    errorText: {
        fontSize: PxFit(13),
        paddingLeft: PxFit(5),
        color: Theme.errorColor,
    },
});

export default compose(
    graphql(GQL.deleteQuestionMutation, {
        name: 'deleteQuestionMutation',
    }),
    graphql(GQL.removeQuestionMutation, {
        name: 'removeQuestionMutation',
    }),
    graphql(GQL.publishQuestion, {
        name: 'publishQuestion',
    }),
    graphql(GQL.QuestionQuery, {
        options: props => ({ variables: { id: props.navigation.getParam('question', {}).id } }),
        name: 'questionQuery',
    }),
    graphql(GQL.UserMeansQuery, {
        options: () => ({ variables: { id: app.me.id } }),
    }),
)(index);
