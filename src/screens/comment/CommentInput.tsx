import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { TouchFeedback, Iconfont, CustomTextInput, Row } from 'components';

import { useMutation, GQL } from 'apollo';
import { app } from 'store';

const CommentInput = props => {
    const [defaultText] = useState('写评论...');
    const [content, setContent] = useState('');

    const {
        questionId,
        style,
        textInputRef,
        reply,
        comment_id,
        parent_comment_id,
        onCommented,
        isPost,
        isSpider,
    } = props;

    const onChangeText = useCallback(value => {
        setContent(value);
    }, []);

    const updateCommentsQuery = useCallback((cache, { data: { createComment } }) => {
        console.log('触发 updateCommentsQuery');
        Toast.show({ content: '评论成功' });
        console.log('createComment', createComment);
        const prev = cache.readQuery({
            query: GQL.questionCommentsQuery,
            variables: {
                commentable_type: isPost ? 'posts' : isSpider ? 'videos' : 'questions',
                commentable_id: questionId,
                limit: 10,
            },
        });
        console.log('prev', prev);
        cache.writeQuery({
            query: GQL.questionCommentsQuery,
            variables: {
                commentable_type: isPost ? 'posts' : isSpider ? 'videos' : 'questions',
                commentable_id: questionId,
                limit: 10,
            },
            data: { comments: [createComment, ...prev.comments] },
        });
    }, []);
    const updateRepliesQuery = useCallback((cache, { data: { createComment } }) => {
        Toast.show({ content: '回复成功' });
        const prev = cache.readQuery({
            query: GQL.childCommentQuery,
            variables: {
                comment_id: parent_comment_id ? parent_comment_id : comment_id,
                limit: 1,
            },
        });
        cache.writeQuery({
            query: GQL.childCommentQuery,
            variables: {
                commentable_type: 'comments',
                comment_id: parent_comment_id ? parent_comment_id : comment_id,
                limit: 1,
            },
            data: {
                comments: [
                    {
                        id: parent_comment_id ? parent_comment_id : comment_id,
                        comments_count: prev.comments[0].comments_count + 1,
                        __typename: 'Comment',
                        comments: [{ ...createComment }, ...prev.comments[0].comments],
                    },
                ],
            },
        });
    }, []);

    const [createCommentMutation] = useMutation(
        comment_id ? GQL.createChildCommentMutation : GQL.createCommentMutation,
        {
            variables: {
                commentable_id: questionId,
                comment_id: comment_id,
                commentable_type: comment_id ? 'comments' : isPost ? 'posts' : isSpider ? 'videos' : 'questions',
                content: content && content.trim(),
            },
            update: comment_id ? updateRepliesQuery : updateCommentsQuery,
            optimisticResponse: {
                __typename: 'Mutation',
                createComment: comment_id
                    ? {
                        __typename: 'Comment',
                        id: -1,
                        user: app.userCache,
                        content,
                        time_ago: '刚刚',
                        liked: false,
                        count_likes: 0,
                        reply: null,
                    }
                    : {
                        __typename: 'Comment',
                        id: -1,
                        user: app.userCache,
                        content,
                        time_ago: '刚刚',
                        liked: false,
                        comments_count: 0,
                        count_likes: 0,
                    },
            },
            onError: error => {
                console.log('error', error);
                const content = error.message.replace('GraphQL error: ', '') || '评论失败';
                Toast.show({ content });
            },
            onCompleted: () => {
                onCommented();
            },
        },
    );

    const createCommentHandler = useCallback(() => {
        Keyboard.dismiss();
        onChangeText('');
        console.log('触发 :');
        createCommentMutation();
    }, []);

    return (
        <View style={{ height: PxFit(60), backgroundColor: '#FFF', justifyContent: 'center' }}>
            <View style={[styles.footerBar, style]}>
                <Row>
                    <Iconfont name={'write'} size={16} color={'#C0CBD4'} />
                    <CustomTextInput
                        textInputRef={textInputRef}
                        placeholder={reply ? reply : defaultText}
                        style={styles.textInput}
                        value={content}
                        onChangeText={onChangeText}
                    />
                </Row>
                <TouchFeedback disabled={content.length < 1} style={styles.touchItem} onPress={createCommentHandler}>
                    <Iconfont
                        name="plane-fill"
                        size={PxFit(22)}
                        color={content.length > 0 ? Theme.boyColor : Theme.subTextColor}
                    />
                </TouchFeedback>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footerBar: {
        alignItems: 'center',
        backgroundColor: '#F9F9FB',
        borderRadius: PxFit(20),
        flexDirection: 'row',
        height: PxFit(40),
        justifyContent: 'space-between',
        marginHorizontal: PxFit(10),
        paddingHorizontal: PxFit(14),
        paddingVertical: PxFit(5),
    },
    textInput: {
        paddingLeft: PxFit(5),
        width: SCREEN_WIDTH - PxFit(100),
    },
    touchItem: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: PxFit(40),
    },
});

export default CommentInput;
