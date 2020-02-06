/*
 * @Author: Gaoxuan
 * @Date:   2019-03-25 13:52:08
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Iconfont, UserTitle, Avatar, TouchFeedback, GenderLabel } from 'components';
import { Theme, PxFit, Tools } from 'utils';

class CommentNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    siwthType = notification => {
        switch (notification.type) {
            case 'FEEDBACK_COMMENT':
                this.content = {
                    tips: '回复了我的反馈',
                    body: Tools.syncGetter('comment.feedback.title', notification),
                };
                break;
            case 'QUESTION_COMMENT':
                this.content = {
                    tips: '评论了我的出题',
                    body: Tools.syncGetter('comment.question.description', notification),
                };
                break;
            case 'REPLY_COMMENT':
                this.content = {
                    tips: '回复了我的评论',
                    body: Tools.syncGetter('comment.parent_comment.content', notification),
                };
                break;
        }
    };

    navigationAction = question => {
        const { navigation } = this.props;
        if (question.form === 0) {
            navigation.navigate('Question', { question, referrer: 'user' });
        } else if (question.form !== 0) {
            navigation.navigate('VideoPost', { questions: [question] });
        }
    };

    render() {
        const { navigation, notification, replyComment, showCommentModal } = this.props;
        if (notification.comment) {
            this.siwthType(notification);
            return (
                <TouchFeedback
                    style={styles.container}
                    onPress={() => {
                        if (notification.type == 'QUESTION_COMMENT') {
                            navigation.navigate('Question', {
                                question: notification.comment.question,
                            });
                        } else if (notification.comment.feedback) {
                            navigation.navigate('FeedbackDetails', {
                                feedback_id: Tools.syncGetter('comment.feedback.id', notification),
                            });
                        } else if (notification.comment.question) {
                            navigation.navigate('Question', {
                                question: notification.comment.question,
                            });
                        }
                        //未知原因 返回值中question为 null
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TouchFeedback
                            style={styles.header}
                            onPress={() =>
                                navigation.navigate('User', { user: Tools.syncGetter('comment.user', notification) })
                            }>
                            <Avatar
                                source={{ uri: Tools.syncGetter('comment.user.avatar', notification) }}
                                userId={Tools.syncGetter('comment.user.id', notification)}
                                size={34}
                            />
                            <View style={styles.user}>
                                <View style={styles.userTop}>
                                    <Text
                                        style={{
                                            color: Theme.black,
                                        }}>
                                        {Tools.syncGetter('comment.user.name', notification)}
                                    </Text>
                                    <UserTitle user={Tools.syncGetter('comment.user', notification)} />
                                    <GenderLabel user={Tools.syncGetter('comment.user', notification)} />
                                </View>

                                <Text style={styles.commenTime}>
                                    {Tools.syncGetter('comment.time_ago', notification)} {this.content.tips}
                                </Text>
                            </View>
                        </TouchFeedback>
                        <TouchFeedback
                            style={styles.replay}
                            onPress={() => {
                                replyComment(notification.comment);
                                showCommentModal();
                            }}>
                            <Text style={{ fontSize: 12, color: Theme.grey }}>回复</Text>
                        </TouchFeedback>
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.content}>{Tools.syncGetter('comment.content', notification)}</Text>
                    </View>
                    <View style={styles.bottom}>
                        <Text>{this.content.body}</Text>
                    </View>
                </TouchFeedback>
            );
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: PxFit(15),
        paddingHorizontal: PxFit(10),
        backgroundColor: Theme.white,
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.lightBorder,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    user: {
        paddingLeft: PxFit(10),
        justifyContent: 'space-between',
        height: PxFit(34),
    },
    userTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commenTime: {
        fontSize: PxFit(11),
        color: Theme.grey,
        lineHeight: PxFit(16),
    },
    center: {
        marginTop: PxFit(10),
        marginLeft: PxFit(44),
    },
    content: {
        color: Theme.black,
        fontSize: PxFit(15),
    },

    bottom: {
        backgroundColor: Theme.lightBorder,
        padding: PxFit(6),
        marginTop: PxFit(10),
        marginLeft: PxFit(44),
    },
    replay: {
        marginRight: 10,
        backgroundColor: '#F0F0F0',
        paddingVertical: 8,
        paddingHorizontal: 13,
        borderRadius: 5,
    },
});

export default CommentNotification;
