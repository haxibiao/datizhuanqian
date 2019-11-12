/*
 * @flow
 * created by wyk made in 2019-04-01 17:53:01
 */
'use strict';
import React, { Component } from 'react';
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
import { Query, Mutation, compose, withApollo, graphql, GQL } from 'apollo';
import { app } from 'store';
import CommentItem from './CommentItem';
import InputCommentModal from './InputCommentModal';
import { BoxShadow } from 'react-native-shadow';
import { observer } from 'mobx-react';

@observer
class CommentOverlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            visible: false,
            modalVisible: false,
            finished: false,
            count_comments: props.question && props.question.count_comments,
            reply: null,
            comment_id: null,
            childLimit: 1,
            parent_comment_id: null,
        };
    }

    //显示动画
    slideUp = () => {
        app.modalIsShow = true;
        this.setState(
            () => ({ visible: true }),
            () => {
                Animated.parallel([
                    Animated.timing(this.state.offset, {
                        easing: Easing.linear,
                        duration: 200,
                        toValue: 1,
                    }),
                ]).start();
            },
        );
    };

    //隐藏动画
    slideDown = () => {
        Animated.parallel([
            Animated.timing(this.state.offset, {
                easing: Easing.linear,
                duration: 200,
                toValue: 0,
            }),
        ]).start(() => {
            this.setState({ visible: false });
            app.modalIsShow = false;
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        try {
            // 更新comment
            if (nextProps.question !== this.props.question) {
                this.setState({ finished: false, count_comments: nextProps.question.count_comments });
            }
        } catch {}
    }

    hideCommentModal = () => {
        this.setState({ modalVisible: false });
    };

    showCommentModal = () => {
        this.setState({ modalVisible: true });
    };

    increaseCountComments = () => {
        this.props.question.count_comments++;
    };

    onCommented = () => {
        this._flatList &&
            this._flatList.scrollToOffset({
                offset: 0,
                animated: true,
            });
        this.setState(prev => {
            count_comments: ++prev.count_comments;
        });
    };

    _renderCommentHeader = comments => {
        let { count_comments } = this.state;
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{count_comments > 0 && count_comments + ' 条'}评论</Text>
                <TouchFeedback style={styles.close} onPress={this.slideDown}>
                    <Iconfont name="close" size={PxFit(20)} color={Theme.defaultTextColor} />
                </TouchFeedback>
            </View>
        );
    };

    renderContent = (comments, fetchMore, loading) => {
        if (!comments) return <Placeholder type="comment" quantity={5} />;
        if (comments && comments.length === 0) return <StatusView.EmptyView />;
        return (
            <FlatList
                ref={ref => (this._flatList = ref)}
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
                            questionId={this.props.question.id}
                            showCommentModal={this.showCommentModal}
                            replyComment={this.replyComment}
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
                ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                    if (this.state.finished) return;
                    fetchMore({
                        variables: {
                            offset: comments.length,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                            if (fetchMoreResult && fetchMoreResult.comments) {
                                if (fetchMoreResult.comments.length < 10) {
                                    this.setState({
                                        finished: true,
                                    });
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

    replyComment = (comment, parent_comment_id) => {
        this.setState({
            reply: `回复 @${comment.user.name}：`,
            comment_id: comment.id,
            parent_comment_id: parent_comment_id,
        });
    };

    switchReplyType = () => {
        this.setState({
            reply: null,
            comment_id: null,
            parent_comment_id: null,
        });
    };

    render() {
        let { onHide, question, hideComment, isPost } = this.props;
        let { visible, offset, modalVisible, reply, comment_id, childLimit, parent_comment_id } = this.state;
        if (!visible || !question) {
            return <View />;
        }
        console.log('question comment', question, isPost);
        return (
            <View style={styles.overlayContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'always'}>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.modal} onPress={this.slideDown} activeOpacity={1} />
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
                            <Query
                                query={GQL.questionCommentsQuery}
                                variables={{
                                    commentable_id: question.id,
                                    commentable_type: isPost ? 'videos' : 'questions',
                                    limit: 10,
                                    childLimit: childLimit,
                                }}
                                fetchPolicy="network-only">
                                {({ data, loading, error, refetch, fetchMore }) => {
                                    console.log('====================================');
                                    console.log('data.comments', data, error);
                                    console.log('====================================');
                                    if (!(data && data.comments)) return null;
                                    let comments = Tools.syncGetter('comments', data);
                                    return (
                                        <BoxShadow
                                            setting={Object.assign({}, shadowOpt, {
                                                height: (SCREEN_HEIGHT * 2) / 3,
                                            })}>
                                            <View style={styles.commentContainer}>
                                                {this._renderCommentHeader(comments)}
                                                <View style={{ flex: 1 }}>
                                                    {this.renderContent(comments, fetchMore, loading)}
                                                </View>
                                                <TouchableOpacity
                                                    style={styles.inputContainer}
                                                    onPress={this.showCommentModal}>
                                                    <View style={styles.textInput}>
                                                        <Text
                                                            style={{ fontSize: PxFit(14), color: Theme.subTextColor }}>
                                                            发表评论
                                                        </Text>
                                                    </View>
                                                    <View style={styles.touchItem}>
                                                        <Iconfont
                                                            name="plane-fill"
                                                            size={PxFit(24)}
                                                            color={Theme.subTextColor}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </BoxShadow>
                                    );
                                }}
                            </Query>
                        </Animated.View>
                    </View>
                    <InputCommentModal
                        visible={modalVisible}
                        hideModal={this.hideCommentModal}
                        questionId={question.id}
                        onCommented={this.onCommented}
                        reply={reply}
                        comment_id={comment_id}
                        parent_comment_id={parent_comment_id}
                        switchReplyType={this.switchReplyType}
                        increaseCountComments={this.increaseCountComments}
                        isPost={isPost}
                    />
                </ScrollView>
            </View>
        );
    }
}

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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        borderTopWidth: PxFit(0.5),
        borderBottomWidth: PxFit(0.5),
        borderColor: Theme.groundColour,
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
        height: PxFit(50),
        flexDirection: 'row',
        alignItems: 'stretch',
        paddingHorizontal: PxFit(14),
        borderTopWidth: PxFit(1),
        borderTopColor: Theme.borderColor,
        backgroundColor: '#fff',
    },
    textInput: {
        flex: 1,
        paddingVertical: PxFit(10),
        paddingRight: PxFit(20),
    },
    touchItem: {
        width: PxFit(40),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});

export default CommentOverlay;
