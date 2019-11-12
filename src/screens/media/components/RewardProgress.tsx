import React, { useMemo, useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { observer, app } from 'store';
import { PxFit, Tools, ISIOS } from '../../../utils';
import * as Progress from 'react-native-progress';
import VideoStore from '../VideoStore';
import { GQL, useMutation } from 'apollo';
import { useBounceAnimation, useLinearAnimation, exceptionCapture } from 'common';
import { transform } from '@babel/core';

const RewardProgress = observer(props => {
    const progress = (VideoStore.rewardProgress / VideoStore.rewardLimit) * 100;
    const me = useMemo(() => app.me, []);

    const [rewardGold, setReward] = useState();
    const [imageAnimation, startImageAnimation] = useBounceAnimation({ value: 0, toValue: 1 });
    const [textAnimation, startTextAnimation] = useLinearAnimation({ duration: 2000 });

    const [playReward] = useMutation(GQL.UserRewardMutation, {
        variables: {
            reward: 'VIDEO_PLAY_REWARD',
        },
        refetchQueries: (): array => [
            {
                query: GQL.UserMetaQuery,
                variables: { id: app.me.id },
            },
        ],
    });

    useEffect(() => {
        async function fetchReward() {
            VideoStore.rewardProgress = 0;
            startImageAnimation();
            const [error, res] = await exceptionCapture(playReward);
            if (error) {
                setReward('领取失败');
            } else {
                const gold = Tools.syncGetter('data.userReward.gold', res);
                setReward(`+${gold}智慧点`);
                startTextAnimation();
            }
        }
        if (Math.abs(progress) >= 100) {
            fetchReward();
        }
    }, [progress]);

    const imageScale = imageAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
    });

    const textOpacity = textAnimation.interpolate({
        inputRange: [0, 0.3, 0.6, 1],
        outputRange: [0, 0.6, 0.9, 0],
    });

    const textTranslateY = textAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, -80],
    });

    const textScale = textAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1.5],
    });

    return (
        <TouchableWithoutFeedback onPress={(): void => Tools.navigate('BillingRecord', { initialPage: 1 })}>
            <Animated.View style={[styles.circleProgress, { transform: [{ scale: imageScale }] }]}>
                <Animated.Text
                    style={[
                        styles.rewardText,
                        { opacity: textOpacity, transform: [{ translateY: textTranslateY }, { scale: textScale }] },
                    ]}>
                    {rewardGold}
                </Animated.Text>
                <Image source={require('@src/assets/images/video_reward_progress.png')} style={styles.rewardImage} />
                {progress > 0 && !ISIOS && (
                    <Progress.Circle
                        progress={progress / 100}
                        size={PxFit(48)}
                        borderWidth={0}
                        color="#ff5644"
                        thickness={PxFit(4)}
                        endAngle={1}
                        strokeCap={'round'}
                    />
                )}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
});
const styles = StyleSheet.create({
    circleProgress: {
        position: 'relative',
        height: PxFit(48),
        width: PxFit(80),
        alignItems: 'center',
    },
    rewardText: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: PxFit(16),
        fontWeight: 'bold',
        color: '#FFB100',
    },
    rewardImage: {
        ...StyleSheet.absoluteFill,
        height: PxFit(48),
        width: PxFit(48),
        left: PxFit(16),
    },
});

export default RewardProgress;
