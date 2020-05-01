/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:39:12
 */

import React, { Component } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { PageContainer, ListFooter, CustomRefreshControl, StatusView } from 'components';

import { Query, withApollo, GQL } from 'apollo';
import { app } from 'store';

import InputModal from './components/InputModal';
import CommentNotificationItem from './components/CommentNotificationItem';

class CommentNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            comment_id: null,
            commentable_id: null,
            reply: null,
            modalVisible: false,
        };
    }

    componentWillUnmount() {
        const { client } = this.props;
        client.query({
            query: GQL.userUnreadQuery,
            variable: {
                id: app.me.id,
            },
            fetchPolicy: 'network-only',
        });
    }

    hideCommentModal = () => {
        this.setState({ modalVisible: false });
    };

    showCommentModal = () => {
        this.setState({ modalVisible: true });
    };

    replyComment = comment => {
        this.setState({
            reply: `回复 @${comment.user.name}：`,
            comment_id: comment.id,
            commentable_id: Helper.syncGetter('feedback.id', comment) || Helper.syncGetter('question.id', comment),
        });
    };

    switchReplyType = () => {
        this.setState({
            reply: null,
            comment_id: null,
        });
    };

    render() {
        const { navigation } = this.props;
        let { comment_id, modalVisible, reply, commentable_id } = this.state;
        return (
            <PageContainer title="评论" white>
                <Query
                    query={GQL.commentNotificationsQuery}
                    variables={{ filter: ['FEEDBACK_COMMENT', 'REPLY_COMMENT', 'QUESTION_COMMENT'] }}
                    fetchPolicy="network-only">
                    {({ data, error, loading, refetch, fetchMore }) => {
                        if (error) return <StatusView.ErrorView onPress={refetch} />;
                        if (loading) return <StatusView.LoadingSpinner />;
                        if (!(data && data.notifications.length > 0)) return <StatusView.EmptyView />;
                        return (
                            <FlatList
                                style={{ backgroundColor: Theme.lightBorder }}
                                data={data.notifications}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <CommentNotificationItem
                                        notification={item}
                                        navigation={navigation}
                                        replyComment={this.replyComment}
                                        showCommentModal={this.showCommentModal}
                                    />
                                )}
                                refreshControl={
                                    <CustomRefreshControl
                                        refreshing={loading}
                                        onRefresh={refetch}
                                        reset={() =>
                                            this.setState({
                                                finished: false,
                                            })
                                        }
                                    />
                                }
                                onEndReachedThreshold={0.3}
                                onEndReached={() => {
                                    fetchMore({
                                        variables: {
                                            offset: data.notifications.length,
                                        },
                                        updateQuery: (prev, { fetchMoreResult }) => {
                                            if (!(fetchMoreResult && fetchMoreResult.notifications.length > 0)) {
                                                this.setState({
                                                    finished: true,
                                                });
                                                return prev;
                                            }
                                            return Object.assign({}, prev, {
                                                notifications: [
                                                    ...prev.notifications,
                                                    ...fetchMoreResult.notifications,
                                                ],
                                            });
                                        },
                                    });
                                }}
                                ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
                            />
                        );
                    }}
                </Query>
                <InputModal
                    visible={modalVisible}
                    hideModal={this.hideCommentModal}
                    reply={reply}
                    comment_id={comment_id}
                    switchReplyType={this.switchReplyType}
                    commentable_id={commentable_id}
                />
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({});

export default withApollo(CommentNotification);
