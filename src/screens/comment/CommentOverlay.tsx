/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
import React, { Component, useState, useRef, useImperativeHandle } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Text,
    Keyboard,
    Animated,
    Easing,
    ScrollView,
} from 'react-native';
import {
    TouchFeedback,
    Iconfont,
    Row,
    ItemSeparator,
    StatusView,
    Placeholder,
    KeyboardSpacer,
    ListFooter,
} from 'components';
import { Theme, PxFit, SCREEN_WIDTH, SCREEN_HEIGHT, ISIOS, Tools } from 'utils';
import { Query, Mutation, compose, withApollo, graphql, GQL, useQuery } from 'apollo';
import { app } from 'store';
import CommentItem from './CommentItem';
import InputCommentModal from './InputCommentModal';

import { BoxShadow } from 'react-native-shadow';

// TODO: 评论模块需重构  满足新的hooks以及适配新的后端接口

const CommentOverlay = React.forwardRef((props, ref) => {
    const { question, isPost } = props;
    const [offset, setOffset] = useState(new Animated.Value(0));
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [finished, setFinished] = useState(false);
    const [count_comments, setCount_comments] = useState(question && question.count_comments);
    const [reply, setReply] = useState(null);
    const [comment_id, setComment_id] = useState(null);
    const [childLimit, setChildLimit] = useState(1);
    const [parent_comment_id, setParent_comment_id] = useState(null);
    const flatListRef = useRef();

    // 显示动画;
    const slideUp = () => {
        setVisible(true);
        Animated.parallel([
            Animated.timing(offset, {
                easing: Easing.linear,
                duration: 200,
                toValue: 1,
            }),
        ]).start();
    };

    useImperativeHandle(
        ref,
        () => ({
            slideUp: () => {
                setVisible(true);
                Animated.parallel([
                    Animated.timing(offset, {
                        easing: Easing.linear,
                        duration: 200,
                        toValue: 1,
                    }),
                ]).start();
            },
            slideDown: () => {
                Animated.parallel([
                    Animated.timing(offset, {
                        easing: Easing.linear,
                        duration: 200,
                        toValue: 0,
                    }),
                ]).start(() => setVisible(false));
            },
        }),
        [visible],
    );

    //隐藏动画
    const slideDown = () => {
        Animated.parallel([
            Animated.timing(offset, {
                easing: Easing.linear,
                duration: 200,
                toValue: 0,
            }),
        ]).start(() => setVisible(false));
    };

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     try {
    //         // 更新comment
    //         if (nextProps.question !== this.props.question) {
    //             this.setState({ finished: false, count_comments: nextProps.question.count_comments });
    //         }
    //     } catch {
    //         console.log('componentWillReceiveProps error');
    //     }
    // }

    const hideCommentModal = () => {
        setModalVisible(false);
    };

    const showCommentModal = () => {
        setModalVisible(true);
    };

    const onCommented = () => {
        flatListRef.current &&
            flatListRef.current.scrollToOffset({
                offset: 0,
                animated: true,
            });

        setCount_comments(count_comments + 1);
    };

    const _renderCommentHeader = comments => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{count_comments > 0 && count_comments + ' 条'}评论</Text>
                <TouchFeedback style={styles.close} onPress={slideDown}>
                    <Iconfont name="close" size={PxFit(20)} color={Theme.defaultTextColor} />
                </TouchFeedback>
            </View>
        );
    };

    const renderContent = (comments, fetchMore, loading) => {
        if (!comments) return <Placeholder type="comment" quantity={5} />;
        if (comments && comments.length === 0) return <StatusView.EmptyView />;
        return (
            <FlatList
                ref={flatListRef}
                style={{ flex: 1 }}
                data={comments}
                onScrollBeginDrag={() => {
                    Keyboard.dismiss();
                }}
                keyboardShouldPersistTaps="always"
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <CommentItem
                            comment={item}
                            questionId={props.question.id}
                            showCommentModal={showCommentModal}
                            replyComment={replyComment}
                            question={props.question}
                            index={index}
                        />
                    );
                }}
                ItemSeparatorComponent={() => (
                    <View
                        style={{
                            marginLeft: PxFit(Theme.itemSpace) + 42,
                            height: 0.6,
                            backgroundColor: Theme.lightGray,
                        }}
                    />
                )}
                // ListHeaderComponent={this._renderAskQuestionComment(comments)}
                ListFooterComponent={() => <ListFooter finished={finished} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    if (finished) return;
                    fetchMore({
                        variables: {
                            offset: comments.length,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                            if (fetchMoreResult && fetchMoreResult.comments) {
                                if (fetchMoreResult.comments.length < 10) {
                                    setFinished(true);
                                }
                                return Object.assign({}, prev, {
                                    comments: [...prev.comments, ...fetchMoreResult.comments],
                                });
                            }
                        },
                    });
                }}
            />
        );
    };

    const replyComment = (comment, parent_comment_id) => {
        setReply(`回复 @${comment.user.name}：`);
        setComment_id(comment.id);
        setParent_comment_id(parent_comment_id);
    };

    const switchReplyType = () => {
        setReply(null);
        setComment_id(null);
        setParent_comment_id(null);
    };

    const { data, loading, error, refetch, fetchMore } = useQuery(GQL.questionCommentsQuery, {
        variables: {
            commentable_type: isPost ? 'videos' : 'questions',
            commentable_id: Tools.syncGetter('id', question),
            limit: 10,
            childLimit: childLimit,
        },
        fetchPolicy: 'network-only',
        skip: Tools.syncGetter('id', question) ? false : true,
    });

    const comments = Tools.syncGetter('comments', data);
    console.log('show overlay', question, visible, error);

    if (!visible || !question || error) {
        return <View />;
    }
    return (
        <View style={styles.overlayContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'always'}>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <TouchableOpacity style={styles.modal} onPress={slideDown} activeOpacity={1} />
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateY: offset.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [(SCREEN_HEIGHT * 2) / 3, 0],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        }}>
                        <BoxShadow
                            setting={Object.assign({}, shadowOpt, {
                                height: (SCREEN_HEIGHT * 2) / 3,
                            })}>
                            <View style={styles.commentContainer}>
                                {_renderCommentHeader(comments)}
                                <View style={{ flex: 1 }}>{renderContent(comments, fetchMore, loading)}</View>
                                <TouchableOpacity style={styles.inputContainer} onPress={showCommentModal}>
                                    <Iconfont name={'write'} size={16} color={'#C0CBD4'} />
                                    <View style={styles.textInput}>
                                        <Text style={{ fontSize: PxFit(14), color: '#C0CBD4' }}>{'写评论...'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </BoxShadow>
                    </Animated.View>
                </View>
                <InputCommentModal
                    visible={modalVisible}
                    hideModal={hideCommentModal}
                    questionId={question.id}
                    onCommented={onCommented}
                    reply={reply}
                    comment_id={comment_id}
                    parent_comment_id={parent_comment_id}
                    switchReplyType={switchReplyType}
                    count_comments={count_comments}
                    isPost={isPost}
                />
            </ScrollView>
        </View>
    );
});

const shadowOpt = {
    width: SCREEN_WIDTH,
    color: '#E8E8E8',
    border: PxFit(3),
    radius: PxFit(12),
    opacity: 0.5,
    x: 0,
    y: 1,
    style: {
        marginTop: 0,
    },
};

const styles = StyleSheet.create({
    overlayContainer: {
        ...StyleSheet.absoluteFill,
        zIndex: 1000,
    },
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    commentContainer: {
        height: (SCREEN_HEIGHT * 2) / 3,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
        backgroundColor: '#fff',
        borderTopLeftRadius: PxFit(12),
        borderTopRightRadius: PxFit(12),
        overflow: 'hidden',
    },
    header: {
        height: PxFit(44),
        // borderTopWidth: PxFit(0.5),
        // borderBottomWidth: PxFit(0.5),
        // borderColor: Theme.groundColour,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: PxFit(15),
        color: Theme.secondaryTextColor,
    },
    close: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: PxFit(44),
        height: PxFit(44),
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        height: PxFit(40),
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: PxFit(10),
        marginBottom: PxFit(10),
        paddingHorizontal: PxFit(14),
        paddingVertical: PxFit(5),
        // borderTopWidth: PxFit(1),
        // borderTopColor: Theme.borderColor,
        borderRadius: PxFit(20),
        backgroundColor: '#F9F9FB',
    },
    textInput: {
        flex: 1,
        paddingVertical: PxFit(10),
        paddingLeft: PxFit(5),
    },
    touchItem: {
        width: PxFit(40),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});

export default CommentOverlay;
