/*
 * @flow
 * created by wyk made in 2019-04-15 17:33:41
 */
'use strict';

import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Iconfont, Row, TouchFeedback, Avatar, UserTitle, GenderLabel, Like } from 'components';
import { Theme, PxFit, Tools } from 'utils';
import ImageItem from './ImageItem';

interface Props {
    posts?: Array<object>;
    post: Post;
    activeIndex?: Number;
    navigation: any;
    isQuestion?: Boolean;
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
    const { navigation, post, activeIndex, posts, isQuestion } = props;
    const { user, created_at, count_comments, description, video, image, count } = post;

    const navigationAction = () => {
        isQuestion
            ? navigation.navigate('UserAnswer', { questions: posts, index: activeIndex })
            : navigation.navigate('VideoPost', { medium: posts, index: activeIndex, isPost: true });
    };

    return (
        <TouchFeedback style={styles.container} onPress={navigationAction}>
            <Row style={{ justifyContent: 'space-between' }}>
                <TouchFeedback onPress={() => navigation.navigate('User', { user })}>
                    <Row>
                        <Avatar source={{ uri: user.avatar }} size={42} />
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
                        <Text style={{ fontSize: 12, color: '#C5C5C5' }}>{Tools.NumberFormat(count)}人答过</Text>
                    </View>
                )}
            </Row>
            <View style={{ paddingVertical: PxFit(10) }}>
                <Text style={{ color: Theme.black, lineHeight: 22 }}>
                    {description}
                    {isQuestion && (
                        <Text
                            onPress={() =>
                                navigation.navigate('Answer', {
                                    category: Tools.syncGetter('category', post),
                                    question_id: null,
                                })
                            }
                            style={{ color: Theme.primaryColor }}>
                            {` #`}
                            {Tools.syncGetter('category.name', post)}
                        </Text>
                    )}
                </Text>
                <ImageItem media={video ? video : image} />
                <Text style={styles.timeText}>{created_at}</Text>
            </View>
            <Row>
                <Like
                    media={post}
                    type="icon"
                    iconSize={PxFit(22)}
                    containerStyle={styles.likeContainer}
                    textStyle={styles.likeTextStyle}
                    isQuestion={isQuestion}
                />
                <TouchFeedback style={styles.row}>
                    <Image source={require('../../../assets/images/comment_icon.png')} style={styles.commentIcon} />
                    <Text style={styles.commentText}>{count_comments || '评论'}</Text>
                </TouchFeedback>
            </Row>
        </TouchFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: PxFit(0.5),
        borderBottomColor: Theme.lightBorder,
        paddingVertical: PxFit(15),
        paddingHorizontal: PxFit(15),
    },
    userName: {
        marginBottom: PxFit(3),
        color: Theme.black,
    },
    rightTextWrap: {
        paddingHorizontal: PxFit(15),
        paddingVertical: PxFit(5),
        backgroundColor: '#F9F9FB',
        borderRadius: PxFit(20),
    },
    timeText: {
        color: '#CCD5E0',
        fontSize: PxFit(12),
        marginTop: PxFit(10),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentIcon: {
        width: PxFit(18),
        height: PxFit(18),
    },
    commentText: {
        paddingLeft: PxFit(5),
        color: '#CCD5E0',
        fontSize: PxFit(13),
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: PxFit(50),
    },
    likeTextStyle: {
        color: '#CCD5E0',
        fontSize: PxFit(13),
        marginStart: PxFit(5),
        marginEnd: PxFit(23),
    },
});

export default PostItem;
