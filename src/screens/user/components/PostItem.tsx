/*
 * @flow
 * created by wyk made in 2019-04-15 17:33:41
 */
'use strict';

import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Iconfont, Row, TouchFeedback, Avatar, UserTitle, GenderLabel, Like, VideoItem } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';

interface User {
    avatar: String;
    name: String;
}

interface Post {
    description: String;
    created_at: String;
    count_comments: Number;
    count_likes: Number;
    user: User;
    id: Number;
    is_ad: Boolean;
    video: Video;
}

interface Video {
    width: Number;
    height: Number;
    url: String;
    cover: String;
}

interface Props {
    posts: Array<object>;
    post: Post;
    activeIndex: Number;
    navigation: any;
}

const PostItem = (props: Props) => {
    const { navigation, post, posts, activeIndex } = props;
    const { video } = post;

    const navigationAction = () => {
        props.navigation.navigate('VideoPost', { medium: posts, index: activeIndex, isPost: true });
    };

    const renderVideo = () => {
        const maxHeight = 240;
        const maxWidth = SCREEN_WIDTH - Theme.itemSpace * 2;
        const videoWidth = (video && video.width) || 1;
        const videoHeight = (video && video.height) || 1;

        const isLargeScale = videoWidth > videoHeight && videoWidth / videoHeight > maxWidth / maxHeight;
        return (
            <View style={styles.image}>
                <Image
                    source={{ uri: video && video.cover }}
                    style={
                        isLargeScale
                            ? {
                                  width: maxWidth,
                                  height: (maxWidth * videoHeight) / videoWidth,
                                  borderRadius: PxFit(5),
                                  backgroundColor: '#000',
                              }
                            : {
                                  width: PxFit(240) * (videoWidth / videoHeight),
                                  height: PxFit(240),
                                  borderRadius: PxFit(5),
                                  backgroundColor: '#000',
                              }
                    }
                />
                <Iconfont
                    name='paused'
                    size={PxFit(34)}
                    color='#fff'
                    style={
                        isLargeScale
                            ? {
                                  position: 'absolute',
                                  top: ((maxWidth * videoHeight) / videoWidth - PxFit(34)) / 2,
                                  left: (PxFit(maxWidth) - PxFit(34)) / 2,
                                  bottom: 0,
                                  right: 0,
                              }
                            : {
                                  position: 'absolute',
                                  top: PxFit(103),
                                  left: (PxFit(240) * (videoWidth / videoHeight) - PxFit(34)) / 2,
                                  bottom: 0,
                                  right: 0,
                              }
                    }
                />
            </View>
        );
    };

    const { user, created_at, count_comments, description } = post;

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
            </Row>
            <View style={{ paddingVertical: PxFit(10) }}>
                <Text style={{ color: Theme.black, lineHeight: 22 }}>{description}</Text>
                {video && <VideoItem video={video} />}
                <Text style={styles.timeText}>{created_at}</Text>
            </View>
            <Row>
                <TouchFeedback style={styles.row} onPress={navigationAction}>
                    <Image source={require('../../../assets/images/comment_icon.png')} style={styles.commentIcon} />
                    <Text style={styles.commentText}>{count_comments || '评论'}</Text>
                </TouchFeedback>
                <Like
                    media={post}
                    type='icon'
                    iconSize={PxFit(22)}
                    containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                    textStyle={{ color: '#CCD5E0', fontSize: 14, marginStart: 5, marginEnd: 23 }}
                />
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
    rewardWrap: {
        backgroundColor: '#F9F9FB',
        borderRadius: PxFit(20),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: PxFit(12),
        height: PxFit(26),
    },
    rewardTitle: {
        fontSize: PxFit(11),
        color: Theme.grey,
    },
    rewardCount: {
        marginLeft: PxFit(5),
        color: Theme.themeRed,
        fontSize: PxFit(11),
    },
    rewardIcon: {
        width: PxFit(16),
        height: PxFit(16),
        marginLeft: PxFit(2),
    },
    image: {
        // marginVertical: PxFit(10),
        marginTop: PxFit(10),
        borderRadius: PxFit(5),
    },
    timeText: {
        color: '#CCD5E0',
        fontSize: PxFit(12),
        marginTop: PxFit(10),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: PxFit(50),
    },
    commentIcon: {
        width: PxFit(20),
        height: PxFit(20),
    },
    commentText: {
        paddingLeft: PxFit(5),
        color: '#CCD5E0',
        fontSize: PxFit(13),
    },
    likeWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: PxFit(50),
    },
    likeText: {
        paddingLeft: PxFit(5),
        color: Theme.backColor,
        fontSize: PxFit(13),
    },
});

export default PostItem;
