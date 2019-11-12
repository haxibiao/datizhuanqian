/*
 * @flow
 * created by wyk made in 2019-04-15 17:33:41
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text, Image } from 'react-native';
import { Iconfont, Row, PlaceholderImage, TouchFeedback, Avatar, UserTitle, GenderLabel, Like } from 'components';
import { Theme, PxFit, Tools, SCREEN_WIDTH } from 'utils';

import { app } from 'store';
interface User {
    avatar: String;
    name: String;
}

interface Question {
    description: String;
    created_at: String;
    count_comments: Number;
    count_likes: Number;
    form: Number;
    is_resolved: any;
    gold: Number;
    video: any;
    user: any;
    image: any;
    count: Number;
    submit: any;
}

interface Props {
    question: Question;
    user: User;
    videos: any;
    activeIndex: Number;
    navigation: any;
}

const AskQuestionItem = (props: Props) => {
    const { question, videos, activeIndex, navigation } = props;

    const navigationAction = () => {
        if (question) {
            props.navigation.navigate('Question', { question, referrer: 'user' });
        } else if (!question && activeIndex) {
            props.navigation.navigate('VideoPost', { videos, index: activeIndex });
        } else if (!question && !activeIndex) {
            props.navigation.navigate('VideoPost', { videos: [{ question }] });
        }

        // if (question) {
        //     props.navigation.navigate('Question', { question, referrer: 'user' });
        // } else {
        // }
        // props.navigation.navigate('VideoPost', { videos: [{ question }] });
    };

    const renderVideo = () => {
        const {
            question: { video },
        } = props;

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
                    name="paused"
                    size={PxFit(34)}
                    color="#fff"
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

    const renderImage = () => {
        const {
            question: { image },
        } = props;

        const maxHeight = 240;
        const maxWidth = SCREEN_WIDTH - Theme.itemSpace * 2;
        const imageWidth = (image && image.width) || 1;
        const imageHeight = (image && image.height) || 1;

        const isLargeScale = maxWidth > maxHeight && imageWidth / imageHeight > maxWidth / maxHeight;

        return (
            <View style={styles.image}>
                <Image
                    source={{ uri: image && image.path }}
                    style={
                        isLargeScale
                            ? {
                                  width: PxFit(maxWidth),
                                  height: (maxWidth * imageHeight) / imageWidth,
                                  borderRadius: PxFit(5),
                                  backgroundColor: '#000',
                              }
                            : {
                                  width: PxFit(240) * (imageWidth / imageHeight),
                                  height: PxFit(240),
                                  borderRadius: PxFit(5),
                                  backgroundColor: '#000',
                              }
                    }
                />
            </View>
        );
    };

    const { gold, is_resolved, form, video, user, image, count, submit } = question;
    console.log('question', question);

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

                {submit === '1' && form === 2 && (
                    <View style={styles.rewardWrap}>
                        <Text style={styles.rewardTitle}>{is_resolved ? '已解决' : '悬赏问答'}</Text>
                        <Text style={[styles.rewardCount, { color: is_resolved ? Theme.grey : Theme.themeRed }]}>
                            {gold}
                        </Text>
                        <Image source={require('../../../assets/images/diamond.png')} style={styles.rewardIcon} />
                    </View>
                )}
                {submit === '1' && form === 0 && (
                    <View style={styles.rewardWrap}>
                        <Text style={styles.rewardTitle}>{Tools.NumberFormat(count)}人答过</Text>
                    </View>
                )}
                {submit === '0' && (
                    <View style={styles.rewardWrap}>
                        <Text style={styles.rewardTitle}>审核中</Text>
                    </View>
                )}
                {submit === '-1' && (
                    <View style={styles.rewardWrap}>
                        <Text style={[styles.rewardTitle, { color: Theme.themeRed }]}>被下架</Text>
                    </View>
                )}
                {submit === '-2' && (
                    <View style={styles.rewardWrap}>
                        <Text style={[styles.rewardTitle, { color: Theme.themeRed }]}>已拒绝</Text>
                    </View>
                )}
            </Row>
            <View style={{ paddingVertical: PxFit(10) }}>
                <Text style={{ color: Theme.black, lineHeight: 22 }}>
                    {question.description}
                    <Text
                        onPress={() =>
                            navigation.navigate('Answer', {
                                category: Tools.syncGetter('category', question),
                                question_id: null,
                            })
                        }
                        style={{ color: Theme.primaryColor }}>
                        {` #`}
                        {Tools.syncGetter('category.name', question)}
                    </Text>
                </Text>
                {video && renderVideo()}
                {image && renderImage()}
                <Text style={styles.timeText}>{question.created_at}</Text>
            </View>
            <Row>
                <TouchFeedback
                    style={styles.row}
                    onPress={() =>
                        props.navigation.navigate('VideoPost', { videos, index: activeIndex, isComment: true })
                    }>
                    <Image source={require('../../../assets/images/comment_icon.png')} style={styles.commentIcon} />
                    <Text style={styles.commentText}>{question.count_comments || '评论'}</Text>
                </TouchFeedback>
                <Like
                    media={question}
                    type="icon"
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

export default AskQuestionItem;
