/*
 * @flow
 * created by wyk made in 2019-03-29 16:41:46
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, ActivityIndicator } from 'react-native';
import { TouchFeedback, Iconfont, SafeText, Avatar, Row, PullChooser } from 'components';

import { Query, compose, graphql, GQL } from 'apollo';

import { withNavigation } from 'react-navigation';

import ChildCommentItem from './ChildCommentItem';

import { app } from 'store';

type replyComment = { id: string, content: any, user: Object, count_likes: boolean, liked: boolean };
type Props = {
    comment: replyComment,
};

class CommentItem extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            liked: props.comment.liked,
            count_likes: props.comment.count_likes,
            bounce: new Animated.Value(1),
            visible: false,
            loadingMore: false,
            limit: 1,
        };
    }

    likeComment = () => {
        this.setState(
            prevState => ({
                liked: !prevState.liked,
                count_likes: prevState.liked ? --prevState.count_likes : ++prevState.count_likes,
            }),
            () => this.bounceAnimation(this.state.liked),
        );
    };

    bounceAnimation = isLiked => {
        this.props.comment.liked = isLiked;
        this.props.comment.count_likes = this.state.count_likes;
        try {
            this.props.toggleLikeMutation({
                variables: {
                    likable_id: this.props.comment.id,
                    likable_type: 'COMMENT',
                },
            });
        } catch (error) {
            console.log('toggleLikeMutation error', error);
        }
        if (isLiked) {
            let { bounce } = this.state;
            bounce.setValue(1);
            Animated.spring(bounce, {
                toValue: 1.2,
                friction: 2,
                tension: 40,
            }).start();
        }
    };

    deleteComment = async () => {
        let result = {};
        let { comment, questionId, deleteCommentMutation } = this.props;
        try {
            result = await deleteCommentMutation({
                variables: {
                    id: comment.id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.questionCommentsQuery,
                        variables: {
                            commentable_id: questionId,
                            limit: 10,
                        },
                        fetchPolicy: 'network-only',
                    },
                ],
            });
        } catch (ex) {
            result.errors = result;
        }
        if (result && result.errors) {
            let str = result.errors.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str });
        } else {
            Toast.show({ content: '删除成功', layout: 'top' });
        }
    };

    showOverlay = comment => {
        const { navigation, showCommentModal, replyComment } = this.props;

        if (app.me.is_admin) {
            PullChooser.show([
                {
                    title: '举报',
                    onPress: () => navigation.navigate('ReportComment', { comment_id: comment.id }),
                },
                {
                    title: '回复',
                    onPress: () => {
                        showCommentModal();
                        replyComment(comment);
                    },
                },
                {
                    title: '删除',
                    onPress: this.deleteComment,
                },
            ]);
        } else {
            PullChooser.show([
                {
                    title: '举报',
                    onPress: () => navigation.navigate('ReportComment', { comment_id: comment.id }),
                },
                {
                    title: '回复',
                    onPress: () => {
                        showCommentModal();
                        replyComment(comment);
                    },
                },
            ]);
        }
    };

    render() {
        const { comment, navigation, questionId, showCommentModal, replyComment } = this.props;
        const { liked, count_likes, bounce, limit, loadingMore } = this.state;
        const scale = bounce.interpolate({
            inputRange: [1, 1.1, 1.2],
            outputRange: [1, 1.25, 1],
        });

        return (
            <Animated.View>
                <TouchFeedback style={styles.comment} onPress={() => this.showOverlay(comment)}>
                    <TouchFeedback onPress={() => navigation.navigate('User', { user: comment.user })}>
                        <Avatar source={comment.user.avatar} userId={comment.user.id} size={PxFit(34)} />
                    </TouchFeedback>
                    <View style={{ flex: 1, marginLeft: PxFit(10) }}>
                        <View style={styles.profile}>
                            <Row>
                                <SafeText style={styles.name}>{comment.user.name}</SafeText>
                            </Row>
                            <View style={{ alignItems: 'center' }}>
                                <Animated.View style={{ transform: [{ scale: scale }] }}>
                                    <TouchFeedback
                                        style={styles.touchItem}
                                        onPress={__.throttle(this.likeComment, 400)}>
                                        <Iconfont
                                            name={'like-fill'}
                                            size={PxFit(20)}
                                            color={liked ? Theme.themeRed : Theme.backColor}
                                        />
                                    </TouchFeedback>
                                </Animated.View>
                                {count_likes > 0 && (
                                    <SafeText
                                        style={[
                                            styles.countLikes,
                                            { color: liked ? Theme.themeRed : Theme.backColor },
                                        ]}>
                                        {count_likes}
                                    </SafeText>
                                )}
                            </View>
                        </View>
                        <View>
                            {comment.content && (
                                <Text style={styles.contentText}>
                                    {comment.content}
                                    <SafeText style={styles.timeAgo}>{`   ${comment.time_ago}`}</SafeText>
                                </Text>
                            )}
                        </View>
                        <View />
                    </View>
                </TouchFeedback>
                <Query
                    query={GQL.childCommentQuery}
                    variables={{ comment_id: comment.id, limit: limit }}
                    fetchPolicy="network-only">
                    {({ data, loading, fetchMore }) => {
                        if (!(data && data.comments && data.comments[0] && data.comments[0].comments.length > 0))
                            return null;
                        let comments = data.comments[0];
                        return (
                            <View>
                                {comments.comments.map((data, index) => {
                                    return (
                                        <ChildCommentItem
                                            comment={data}
                                            parent_comment_id={comments.id}
                                            comments_count={comment.comments_count}
                                            key={index}
                                            showCommentModal={showCommentModal}
                                            replyComment={replyComment}
                                            questionId={questionId}
                                            navigation={navigation}
                                        />
                                    );
                                })}

                                <TouchFeedback
                                    style={{
                                        marginLeft: PxFit(74),
                                        paddingLeft: PxFit(Theme.itemSpace),
                                        paddingTop: PxFit(Theme.itemSpace),
                                    }}
                                    onPress={() => {
                                        if (comments.comments_count == comments.comments.length) {
                                        } else if (limit == 1) {
                                            this.setState({
                                                limit: 10,
                                            });
                                        } else if (limit == 10) {
                                            this.setState({
                                                loadingMore: true,
                                            });
                                            fetchMore({
                                                variables: {
                                                    offset: comments.comments.length,
                                                },
                                                updateQuery: (prev, { fetchMoreResult }) => {
                                                    if (
                                                        fetchMoreResult &&
                                                        fetchMoreResult.comments &&
                                                        fetchMoreResult.comments[0] &&
                                                        fetchMoreResult.comments[0].comments.length > 0
                                                    ) {
                                                        this.setState({
                                                            loadingMore: false,
                                                        });
                                                        return Object.assign({}, prev, {
                                                            comments: [
                                                                Object.assign({}, prev.comments[0], {
                                                                    comments: [
                                                                        ...prev.comments[0].comments,
                                                                        ...fetchMoreResult.comments[0].comments,
                                                                    ],
                                                                }),
                                                            ],
                                                        });
                                                    }
                                                },
                                            });
                                        }
                                    }}>
                                    {loading || loadingMore ? (
                                        <Row style={{ paddingBottom: 10 }}>
                                            <ActivityIndicator size="small" color={Theme.grey} />
                                            <Text
                                                style={{
                                                    fontSize: PxFit(12),
                                                    color: Theme.grey,
                                                    paddingLeft: PxFit(7),
                                                }}>
                                                加载中
                                            </Text>
                                        </Row>
                                    ) : (
                                        this.showLoading(comments)
                                    )}
                                </TouchFeedback>
                            </View>
                        );
                    }}
                </Query>
            </Animated.View>
        );
    }

    showLoading = comments => {
        let { limit } = this.state;
        if (comments.comments_count == comments.comments.length) {
            return null;
        }
        if (comments.comments_count > comments.comments.length && limit == 1) {
            return (
                <Row style={{ paddingBottom: 10 }}>
                    <Text style={{ fontSize: PxFit(12), color: Theme.grey }}>{`展开${comments.comments_count -
                        1}条回复`}</Text>
                    <Iconfont name={'down'} size={12} color={Theme.grey} />
                </Row>
            );
        }
        return (
            <Row style={{ paddingBottom: 10 }}>
                <Text style={{ fontSize: PxFit(12), color: Theme.grey }}>展开更多回复</Text>
                <Iconfont name={'down'} size={12} color={Theme.grey} />
            </Row>
        );
    };
}

const styles = StyleSheet.create({
    comment: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: PxFit(Theme.itemSpace),
    },
    profile: {
        flex: 1,
        height: PxFit(30),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    touchItem: {
        width: PxFit(36),
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: PxFit(14),
        fontWeight: '200',
        paddingRight: PxFit(4),
        color: Theme.secondaryTextColor,
    },
    askAnswer: {
        paddingVertical: PxFit(1),
        paddingHorizontal: PxFit(6),
        marginHorizontal: PxFit(5),
        borderRadius: PxFit(10),
    },
    askAnswerText: {
        fontSize: PxFit(8),
        color: Theme.black,
        lineHeight: PxFit(10),
        paddingLeft: PxFit(1),
    },
    bestAskAnswerText: {
        fontSize: PxFit(8),
        color: '#fff',
        lineHeight: PxFit(10),
        paddingLeft: PxFit(1),
    },
    timeAgo: {
        fontSize: PxFit(12),
        fontWeight: '200',
        color: Theme.grey,
        marginLeft: 5,
    },
    countLikes: {
        fontSize: PxFit(12),
        fontWeight: '200',
        color: Theme.primaryColor,
    },
    contentText: {
        fontSize: PxFit(14),
        lineHeight: PxFit(20),
        fontWeight: '400',
        color: Theme.defaultTextColor,
    },
    linkText: {
        lineHeight: PxFit(22),
        color: Theme.linkColor,
    },
});

export default compose(
    withNavigation,
    graphql(GQL.toggleLikeMutation, { name: 'toggleLikeMutation' }),
    graphql(GQL.deleteCommentMutation, { name: 'deleteCommentMutation' }),
)(CommentItem);
