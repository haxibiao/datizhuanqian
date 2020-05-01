import React, { useMemo, useState, useCallback } from 'react';
import {
    DeviceEventEmitter,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Image,
    ImageBackground,
} from 'react-native';
import { Iconfont, TouchFeedback } from '@src/components';

import { useApolloClient, useMutation, GQL } from '@src/apollo';
import { useBounceAnimation } from '@src/common';
import { app } from '@src/store';
import { observer } from '../store';
import { useNavigation } from 'react-navigation-hooks';
import AnswerOverlay from './AnswerOverlay';

export default observer(({ isAnswered, isSelf, user, question, store, showAnswerResult }) => {
    const { order, answered, isAudit, isAudited, selectedAnswers, answerQuestion } = store;
    const [isFavorite, setFavorite] = useState(question.favorite_status);
    const [animation, startAnimation] = useBounceAnimation({ value: 1, toValue: 1.2 });

    const showComment = useCallback(() => {
        if (!isAudit && !answered) {
            Toast.show({ content: '答完此题再评论哦', layout: 'bottom' });
        } else {
            DeviceEventEmitter.emit('showComment', question);
        }
    }, [isAudit, answered, question]);

    const nextQuestion = useCallback(() => {
        DeviceEventEmitter.emit('nextQuestion', order);
    }, [order]);

    const [favoriteMutation] = useMutation(GQL.toggleFavoriteMutation, {
        variables: {
            data: {
                favorable_id: question.id,
            },
        },
        client: app.mutationClient,
    });

    const [toggleLikeMutation] = useMutation(GQL.toggleLikeMutation, {
        variables: {
            likable_id: question.id,
            likable_type: 'QUESTION',
        },
        client: app.mutationClient,
    });

    const [answerMutation] = useMutation(GQL.QuestionAnswerMutation, {
        variables: {
            id: question.id,
            answer: selectedAnswers || 'A',
        },
        client: app.mutationClient,
        errorPolicy: 'all',
        refetchQueries: () => [
            {
                query: GQL.UserMetaQuery,
                variables: { id: app.me.id },
                fetchPolicy: 'network-only',
            },
        ],
    });

    const toggleFavorite = useCallback(() => {
        setFavorite(f => !f);
        favoriteMutation();
    }, [favoriteMutation]);

    const likeQuestion = useCallback(async () => {
        question.liked ? question.count_likes-- : question.count_likes++;
        question.liked = !question.liked;
        if (question.liked) {
            startAnimation();
        }
        const [error] = await Helper.exceptionCapture(toggleLikeMutation);
        if (error) {
            question.liked ? question.count_likes-- : question.count_likes++;
            question.liked = !question.liked;
            Toast.show({ content: '点赞失败' });
        }
    }, [question]);

    const scale = animation.interpolate({
        inputRange: [1, 1.1, 1.2],
        outputRange: [1, 1.25, 1],
    });

    // 提交后显示模态框
    const showResultsOverlay = useCallback(
        ({ question, isAudit, isAudited, selectedAnswers }) => {
            // 计算模态框所需参数;
            let result, gold, ticket;
            const type = isAudit ? 'audit' : 'answer';
            if (isAudit) {
                gold = 0;
                ticket = question.ticket;
                result = isAudited;
            } else {
                if (question.answer === selectedAnswers) {
                    gold = question.gold;
                    ticket = user.ticket || 0;
                    result = true;
                } else {
                    gold = 0;
                    ticket = question.ticket;
                    result = false;
                }
            }

            !showAnswerResult && AnswerOverlay.show({ question, result, gold, ticket, type });
        },
        [user],
    );

    // 手动提交
    const handler = useCallback(async () => {
        // 提交答案
        if (!answered && !isAudit) {
            // 触发answerQuestion事件，传递答题结果
            DeviceEventEmitter.emit('answerQuestion', answerQuestion());
            showResultsOverlay({
                isAudit,
                isAudited,
                question,
                selectedAnswers,
            });
            try {
                await answerMutation();
            } catch (err) {
                Toast.show({ content: err.toString().replace(/Error: GraphQL error: /, '') || '好像出了点问题' });
            }
        } else {
            // 下一题
            nextQuestion();
        }
    }, [isAudit, isAudited, answered, question, selectedAnswers, showResultsOverlay, answerMutation]);

    const onSubmit = useMemo(() => __.throttle(handler, 400), [handler]);

    const buttonInfo = useMemo(() => {
        // #5F93FD
        const info = {
            name: '下一题',
            color: '#FECF3F',
            imageBack: require('@src/assets/images/bt_answer_next.png'),
            disabled: false,
            textColor: '#6D3D04',
        };
        if (isAnswered || isSelf) {
            info.name = isSelf ? '仅浏览' : '已答过';
            info.color = '#666666';
            info.disabled = true;
        } else if (isAudit) {
            info.name = '下一题';
            info.imageBack = require('@src/assets/images/bt_answer_next.png');
            info.disabled = false;
        } else if (!answered) {
            info.name = '提交答案';
            info.imageBack = require('@src/assets/images/bt_answer_submit.png');
            info.textColor = '#fff';
            info.disabled = selectedAnswers.length > 0 ? false : true;
        }
        console.log('info :', info);
        return info;
    }, [selectedAnswers, answered, isAudit]);
    console.log('isAudit :', isAudit);
    return (
        <View style={styles.container}>
            <View style={styles.sideTools}>
                <TouchableOpacity activeOpacity={0.8} style={styles.toolItem} onPress={toggleFavorite}>
                    <View style={styles.iconWrap}>
                        <Image
                            source={
                                isFavorite
                                    ? require('@src/assets/images/ic_answer_favorite_active.png')
                                    : require('@src/assets/images/ic_answer_favorite_inactive.png')
                            }
                            style={{ height: PxFit(16), width: PxFit(16) }}
                        />
                    </View>
                    <Text
                        style={[styles.itemName, { color: isFavorite ? Theme.primaryColor : Theme.defaultTextColor }]}>
                        {isFavorite ? '已收藏' : '收藏'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.toolItem} onPress={showComment}>
                    <View style={styles.iconWrap}>
                        <Image
                            source={require('@src/assets/images/ic_answer_comment.png')}
                            style={{ height: PxFit(16), width: PxFit(16) }}
                        />
                    </View>
                    <Text style={styles.itemName}>
                        评论
                        {Helper.count(question.count_comments) > 0 && ' ' + Helper.count(question.count_comments)}
                    </Text>
                </TouchableOpacity>
                <Animated.View style={[styles.toolItem, { transform: [{ scale }] }]}>
                    <TouchableOpacity style={styles.toolItem} activeOpacity={0.8} onPress={likeQuestion}>
                        <View style={styles.iconWrap}>
                            <Image
                                source={
                                    question.liked
                                        ? require('@src/assets/images/ic_answer_like_active.png')
                                        : require('@src/assets/images/ic_answer_like_inactive.png')
                                }
                                style={{ height: PxFit(16), width: PxFit(16) }}
                            />
                        </View>
                        <Text
                            style={[
                                styles.itemName,
                                { color: question.liked ? Theme.primaryColor : Theme.defaultTextColor },
                            ]}>
                            点赞
                            {Helper.count(question.count_likes) > 0 && ' ' + Helper.count(question.count_likes)}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
            <TouchFeedback
                disabled={buttonInfo.disabled}
                // style={[styles.mainButton, { backgroundColor: buttonInfo.color }]}
                onPress={onSubmit}>
                <ImageBackground source={buttonInfo.imageBack} style={styles.mainButton}>
                    <Text
                        style={[
                            styles.mainButtonText,
                            {
                                color: buttonInfo.textColor,
                            },
                        ]}>
                        {buttonInfo.name}
                    </Text>
                </ImageBackground>
            </TouchFeedback>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: Device.WIDTH,
        height: Device.HAS_HOME_INDICATOR ? PxFit(64) : PxFit(52),
        paddingBottom: Device.HAS_HOME_INDICATOR ? PxFit(12) : 0,
        paddingHorizontal: PxFit(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    },
    sideTools: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'stretch',
    },
    toolItem: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrap: {
        height: PxFit(30),
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemName: {
        fontSize: PxFit(11),
        color: Theme.defaultTextColor,
    },
    mainButton: {
        // flex: 1,
        height: PxFit(36),
        width: (PxFit(36) * 560) / 120,

        justifyContent: 'center',
        alignItems: 'center',
    },
    mainButtonText: {
        fontSize: PxFit(14),

        fontWeight: '500',
        letterSpacing: PxFit(4),
    },
});
