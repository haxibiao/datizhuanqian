import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { TouchFeedback, Avatar } from '@src/components';
import { Theme, PxFit, Tools, SCREEN_WIDTH } from '@src/utils';
import { useApolloClient, useMutation, useQuery, GQL } from '@src/apollo';
import { exceptionCapture, syncGetter } from '@src/common';
import { app, config } from '@src/store';
import { observer, useQuestionStore } from '../store';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from 'react-navigation-hooks';
import AnswerOverlay from './AnswerOverlay';
import FirstWithdrawTips from './FirstWithdrawTips';
import AnswerResult from './AnswerResult';
import { Overlay } from 'teaset';
import { BoxShadow } from 'react-native-shadow';
const shadowOpt = {
    width: SCREEN_WIDTH,
    height: Theme.HOME_INDICATOR_HEIGHT + PxFit(60),
    color: '#E8E8E8',
    border: PxFit(1),
    // radius: PxFit(10),
    opacity: 0.5,
    x: 0,
    y: -1,
    style: {
        marginTop: 0,
    },
};

export default observer(({ showComment, isAnswered, isSelf, user, store }) => {
    const client = useApolloClient();
    const navigation = useNavigation();
    const {
        submitted,
        isAudit,
        audited,
        question,
        answerCount,
        correctCount,
        selectedAnswers,
        nextQuestion,
        answerQuestion,
        resetCursor,
    } = store;
    const [likeState, setLikeState] = useState({ likes: question.count_likes, liked: question.liked });

    const [likeMutation] = useMutation(GQL.toggleLikeMutation, {
        variables: {
            likable_id: question.id,
            likable_type: 'QUESTION',
        },
    });
    const [answerMutation] = useMutation(GQL.QuestionAnswerMutation, {
        variables: {
            id: question.id,
            answer: selectedAnswers.join(''),
        },
        errorPolicy: 'all',
        refetchQueries: () => [
            {
                query: GQL.UserMetaQuery,
                variables: { id: app.me.id },
                fetchPolicy: 'network-only',
            },
        ],
    });

    const likeQuestion = useCallback(() => {
        setLikeState(state => {
            likeMutation();
            return {
                liked: !state.liked,
                count_likes: state.liked ? --state.likes : ++state.likes,
            };
        });
    }, [likeMutation]);

    // 提交后显示模态框
    const showResultsOverlay = useCallback(
        ({ question, isAudit, audited, selectedAnswers }) => {
            // 计算模态框所需参数;
            let result, gold, ticket;
            const type = isAudit ? 'audit' : 'answer';
            if (isAudit) {
                gold = 0;
                ticket = question.ticket;
                result = audited;
            } else {
                if (question.answer === selectedAnswers.sort().join('')) {
                    gold = question.gold;
                    ticket = user.ticket || 0;
                    result = true;
                } else {
                    gold = 0;
                    ticket = question.ticket;
                    result = false;
                }
            }
            AnswerOverlay.show({ question, result, gold, ticket, type });
        },
        [user],
    );

    // 提交
    const onSubmit = useCallback(async () => {
        if (selectedAnswers.length > 0 && !submitted) {
            answerQuestion();
            showResultsOverlay({
                isAudit,
                audited,
                question,
                selectedAnswers,
            });
            try {
                await answerMutation();
            } catch (err) {
                Toast.show({ content: err.toString().replace(/Error: GraphQL error: /, '') || '好像出了点问题' });
            }
        } else {
            nextQuestion();
        }
    }, [isAudit, audited, submitted, question, selectedAnswers, showResultsOverlay, answerMutation]);

    // 提现提示
    const withdrawTips = useCallback(() => {
        if (syncGetter('gold', user) >= 600 && !app.withdrawTips) {
            if (syncGetter('wallet.total_withdraw_amount', user) <= 0 || !data.user.wallet) {
                let overlayViewRef;
                const overlayView = (
                    <Overlay.View animated ref={ref => (overlayViewRef = ref)}>
                        <View style={styles.overlayInner}>
                            <FirstWithdrawTips hide={() => overlayViewRef.close()} navigation={this.props.navigation} />
                        </View>
                    </Overlay.View>
                );
                Overlay.show(overlayView);
            }
        }
    }, []);

    // 广告触发, iOS不让苹果审核轻易发现答题触发广告，设置多一点，比如答题100个
    // 安卓提高到5个题计算及格和视频奖励
    const showAnswerResult = useCallback(() => {
        if (answerCount === answerScope) {
            let overlayViewRef;
            const overlayView = (
                <Overlay.View animated modal ref={ref => (overlayViewRef = ref)}>
                    <View style={styles.overlayInner}>
                        <AnswerResult
                            hide={() => overlayViewRef.close()}
                            navigation={navigation}
                            answer_count={answerCount}
                            error_count={answerCount - correctCount}
                        />
                    </View>
                </Overlay.View>
            );
            Overlay.show(overlayView);
            resetCursor();
        }
    }, [client, navigation, answerCount]);

    useEffect(() => {
        if (!config.disableAd && (submitted || audited)) {
            withdrawTips();
            showAnswerResult();
        }
    }, [submitted, audited]);

    const buttonInfo = useMemo(() => {
        // 5F93FD
        const info = {
            name: '下一题',
            color: '#FFCC01',
            disabled: false,
        };
        if (isAnswered || isSelf) {
            info.name = isSelf ? '仅浏览' : '已答过';
            info.color = '#666666';
            info.disabled = true;
        } else if (selectedAnswers.length > 0 && !submitted) {
            info.name = '提交答案';
            info.color = '#74A1FF';
        }
        return info;
    }, [selectedAnswers, submitted, isAudit]);
    return (
        <BoxShadow setting={shadowOpt}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.sideButton} onPress={likeQuestion}>
                    <Image
                        style={styles.sideButtonIcon}
                        source={
                            likeState.liked
                                ? require('@src/assets/images/ic_liked.png')
                                : require('@src/assets/images/ic_like.png')
                        }
                    />
                    {/* <Text style={styles.sideButtonText}>{'100点赞'}</Text> */}
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={buttonInfo.disabled}
                    style={[styles.middleButton, { backgroundColor: buttonInfo.color }]}
                    onPress={onSubmit}>
                    <Text style={styles.middleButtonText}>{buttonInfo.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sideButton} onPress={showComment}>
                    <Image style={styles.sideButtonIcon} source={require('@src/assets/images/comment_item.png')} />
                    {/* <Text style={styles.sideButtonText}>{'20评论'}</Text> */}
                </TouchableOpacity>
            </View>
        </BoxShadow>
    );
});

const middleButtonWidth = SCREEN_WIDTH / 3;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: PxFit(10),
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(10),
        backgroundColor: '#fff',
        // borderTopLeftRadius: PxFit(10),
        // borderTopRightRadius: PxFit(10),
    },
    sideButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: PxFit(20),
    },
    sideButtonIcon: {
        width: PxFit(36),
        height: PxFit(36),
        borderRadius: PxFit(18),
    },
    sideButtonText: {
        fontSize: PxFit(12),
        color: '#212121',
        marginTop: PxFit(4),
    },
    middleButton: {
        width: PxFit(130),
        height: PxFit(40),
        borderRadius: PxFit(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleButtonText: {
        fontSize: PxFit(16),
        color: '#fff',
        fontWeight: '500',
        letterSpacing: PxFit(2),
    },
});
