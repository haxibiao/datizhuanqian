/*
 * @flow
 * created by wyk made in 2019-03-29 16:41:46
 */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Dimensions, Animated } from 'react-native';
import {
    TouchFeedback,
    Iconfont,
    Center,
    SafeText,
    Avatar,
    Row,
    PullChooser,
    UserTitle,
    GenderLabel,
} from 'components';
import { Theme, PxFit, WPercent, Tools, SCREEN_WIDTH } from 'utils';
import { compose, graphql, Query, Mutation, GQL } from 'apollo';

import { withNavigation } from 'react-navigation';
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
            limit: 1,
            count_replyComment: props.comments_count, //发布评论数量
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

    showOverlay = (comment, parent_comment_id) => {
        let { navigation, showCommentModal, replyComment } = this.props;
        if (app.userCache && app.userCache.is_admin) {
            PullChooser.show([
                {
                    title: '举报',
                    onPress: () => navigation.navigate('ReportComment', { comment_id: comment.id }),
                },
                {
                    title: '回复',
                    onPress: () => {
                        showCommentModal();
                        replyComment(comment, parent_comment_id);
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
                        replyComment(comment, parent_comment_id);
                    },
                },
            ]);
        }
    };

    render() {
        let { comment, navigation, questionId, user, parent_comment_id } = this.props;
        let { liked, count_likes, bounce, visible, limit, count_replyComment } = this.state;
        let scale = bounce.interpolate({
            inputRange: [1, 1.1, 1.2],
            outputRange: [1, 1.25, 1],
        });
        return (
            <Animated.View>
                <TouchFeedback
                    style={{
                        marginLeft: PxFit(42),
                        paddingHorizontal: PxFit(Theme.itemSpace),
                        marginTop: PxFit(5),
                    }}
                    onPress={() => this.showOverlay(comment, parent_comment_id)}>
                    <TouchFeedback
                        onPress={() => navigation.navigate('User', { user: comment.user })}
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar source={comment.user.avatar} size={PxFit(24)} />
                        <View style={[styles.profile, { marginLeft: PxFit(10) }]}>
                            <Row>
                                <SafeText style={styles.name}>{comment.user.name}</SafeText>
                            </Row>
                            <View style={{ alignItems: 'center' }}>
                                <Animated.View style={{ transform: [{ scale: scale }] }}>
                                    <TouchFeedback
                                        style={styles.touchItem}
                                        onPress={Tools.throttle(this.likeComment, 400)}>
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
                    </TouchFeedback>
                    <View
                        style={{
                            width: SCREEN_WIDTH - (PxFit(42) + PxFit(34) + PxFit(Theme.itemSpace) * 2),
                            marginLeft: PxFit(34),
                        }}>
                        <Row>
                            {comment.content && (
                                <Text style={styles.contentText}>
                                    {comment.reply && (
                                        <Text>
                                            回复
                                            <Text style={{ color: Theme.confirmColor, textAlignVertical: 'top' }}>
                                                {` @${comment.reply.user.name}`}
                                                <Text style={{ color: Theme.defaultTextColor }}>：</Text>
                                            </Text>
                                        </Text>
                                    )}
                                    {comment.content}
                                    <SafeText style={styles.timeAgo}>{`   ${comment.time_ago}`}</SafeText>
                                </Text>
                            )}
                        </Row>
                    </View>
                </TouchFeedback>
            </Animated.View>
        );
    }
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
