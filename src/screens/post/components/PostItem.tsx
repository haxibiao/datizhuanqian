/*
 * @flow
 * created by wyk made in 2019-04-15 17:33:41
 */
'use strict';

import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Iconfont, Row, TouchFeedback, Avatar, UserTitle, GenderLabel, Like } from 'components';
import ImageItem from './ImageItem';

interface Props {
    posts?: Array<object>;
    post: Post;
    activeIndex?: Number;
    navigation: any;
    isQuestion?: Boolean;
    orderByHot?: any;
}

interface Post {
    id: Number;
    description: String;
    created_at: String;
    count_comments: Number;
    count_likes: Number;
    user: User;
    is_ad?: Boolean;
    video: Video;
    image: ImageData;
    category?: Categrory;
    count?: Number;
}

interface User {
    avatar: String;
    name: String;
}

interface Video {
    width: any;
    height: any;
    url: string;
    cover: string;
}

interface ImageData {
    id: Number;
    width: any;
    height: any;
    path: string;
}

interface Categrory {
    id: Number;
    name: String;
}

const PostItem = (props: Props) => {
    const { navigation, post, activeIndex, posts, isQuestion, orderByHot } = props;
    const { user, created_at, count_comments, description, video, image, count } = post;
    const navigationAction = () => {
        isQuestion
            ? navigation.navigate('UserAnswer', { questions: posts, user, index: activeIndex, orderByHot })
            : navigation.navigate('VideoPost', { medium: posts, index: activeIndex, isPost: true });
    };

    return (
        <TouchFeedback style={styles.container} onPress={navigationAction}>
            <Row style={{ justifyContent: 'space-between' }}>
                <TouchFeedback onPress={() => navigation.navigate('User', { user })}>
                    <Row>
                        <Avatar source={{ uri: user.avatar }} size={PxFit(46)} userId={Helper.syncGetter('id', user)} />
                        <View style={{ marginLeft: PxFit(8) }}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Row>
                                <GenderLabel user={user} size={PxFit(8)} />
                                <UserTitle user={user} />
                            </Row>
                        </View>
                    </Row>
                </TouchFeedback>
                {isQuestion && (
                    <View style={styles.rightTextWrap}>
                        <Text style={{ fontSize: 12, color: '#C5C5C5' }}>{Helper.count(count)}人答过</Text>
                    </View>
                )}
            </Row>
            <View style={{ paddingVertical: PxFit(10) }}>
                <Text
                    style={{ color: '#333333', paddingVertical: PxFit(10), fontSize: Font(14), lineHeight: PxFit(22) }}>
                    {description}
                    {isQuestion && (
                        <Text
                            onPress={() =>
                                navigation.navigate('Answer', {
                                    category: Helper.syncGetter('category', post),
                                    question_id: null,
                                })
                            }
                            style={{ color: '#7094BD' }}>
                            {` #`}
                            {Helper.syncGetter('category.name', post)}
                        </Text>
                    )}
                </Text>
                <ImageItem media={video ? video : image} />
            </View>
            <Row style={{ justifyContent: 'space-between', marginTop: PxFit(10) }}>
                <Text style={styles.timeText}>{created_at}</Text>
                <Row>
                    <Like
                        media={post}
                        type="icon"
                        iconSize={Font(18)}
                        containerStyle={styles.likeContainer}
                        textStyle={styles.likeTextStyle}
                        isQuestion={isQuestion}
                    />
                    <TouchFeedback style={styles.row}>
                        <Image source={require('@src/assets/images/comment_icon.png')} style={styles.commentIcon} />
                        <Text style={styles.commentText}>{count_comments || '评论'}</Text>
                    </TouchFeedback>
                </Row>
            </Row>
        </TouchFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.lightBorder,
        paddingVertical: PxFit(15),
        paddingHorizontal: PxFit(17),
    },
    userName: {
        marginBottom: PxFit(5),
        color: '#424242',
        fontSize: Font(14),
    },
    rightTextWrap: {
        paddingHorizontal: PxFit(17),
        paddingVertical: PxFit(5),
        backgroundColor: '#F9F9FB',
        borderRadius: PxFit(20),
    },
    timeText: {
        color: '#CCD5E0',
        fontSize: Font(13),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentIcon: {
        width: Font(16),
        height: Font(16),
    },
    commentText: {
        paddingLeft: PxFit(5),
        color: '#CCD5E0',
        fontSize: Font(13),
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: PxFit(20),
    },
    likeTextStyle: {
        color: '#CCD5E0',
        fontSize: Font(13),
        marginStart: PxFit(5),
        marginEnd: PxFit(23),
    },
});

export default PostItem;
