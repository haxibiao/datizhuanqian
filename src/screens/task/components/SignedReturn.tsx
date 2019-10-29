/*
 * @flow
 * created by wyk made in 2019-09-12 11:19:10
 */

import React, { useMemo, useCallback, useState, useLayoutEffect, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, ISIOS, Tools, WPercent } from 'utils';
import { TouchFeedback } from 'components';
import { GQL, useMutation } from 'apollo';
import { ttad } from 'native';
import { app } from 'store';

interface Props {
    gold: number;
    reward: number;
    close: () => void;
    client: any;
}

const SignedReturn = (props: Props) => {
    const { gold, reward, close, client } = props;
    const me = useMemo(() => app.me, []);

    const doubleReward = useCallback(() => {
        return client.mutate({
            mutation: GQL.UserRewardMutation,
            variables: { reward: 'SIGNIN_VIDEO_REWARD' },
            refetchQueries: (): array => [
                {
                    query: GQL.SignInsQuery,
                },
                {
                    query: GQL.UserMetaQuery,
                    variables: { id: app.me.id },
                },
            ],
        });
    }, [client]);

    const loadAd = useCallback(() => {
        close();
        console.log('start');
        ttad.RewardVideo.loadAd({ ...me.adinfo, uid: me.id }).then(() => {
            // 开始看奖励视频
            ttad.RewardVideo.startAd({
                ...me.adinfo,
                uid: me.id,
            })
                .then(result => {
                    doubleReward();
                    Toast.show({ content: '领取双倍奖励成功' });
                })
                .catch(error => {
                    console.log('error', error);
                    Toast.show({ content: '视频出错' });
                });
        });
    }, [close, doubleReward, me.adinfo, me.id]);

    return (
        <View
            style={{
                // backgroundColor: '#FFF',

                width: OVERLAY_WIDTH,
            }}>
            <ImageBackground
                style={styles.overlayImage}
                source={require('../../../assets/images/attendance_overlay.png')}>
                <View style={styles.overlayHeader}>
                    <Text style={styles.whiteText1}>签到成功</Text>
                    <Text style={styles.whiteText2}>
                        恭喜获得
                        <Text style={styles.highlightText}>{gold}</Text>
                        智慧点
                        {reward > 0 && (
                            <>
                                ，<Text style={styles.highlightText}>{reward}</Text>
                                贡献值
                            </>
                        )}
                    </Text>
                </View>
            </ImageBackground>
            <View style={styles.TTAD}>
                <View>
                    <ttad.FeedAd adWidth={WPercent(90)} />
                </View>
                <TouchFeedback
                    onPress={() => {
                        ISIOS ? close() : loadAd();
                    }}>
                    <ImageBackground
                        style={styles.loadAdButton}
                        source={require('../../../assets/images/attendance_button.png')}>
                        <Text style={styles.buttonText}>{ISIOS ? '知道了' : '获取双倍奖励'}</Text>
                    </ImageBackground>
                </TouchFeedback>
            </View>
        </View>
    );
};

const OVERLAY_WIDTH = WPercent(90);
const OVERLAY_HEIGHT = (OVERLAY_WIDTH * 2655) / 1819;

const styles = StyleSheet.create({
    TTAD: {
        alignItems: 'center',
        // flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#FFF',
        // height: 80,
        width: OVERLAY_WIDTH,
        marginTop: -(OVERLAY_HEIGHT / 3 + 10),
        borderRadius: PxFit(10),
        paddingBottom: PxFit(10),
        minHeight: OVERLAY_HEIGHT / 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    container: {
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    highlightText: {
        color: '#FFCC01',
        fontWeight: 'bold',
    },
    loadAdButton: {
        alignItems: 'center',
        height: (OVERLAY_WIDTH * 0.6 * 258) / 995,
        justifyContent: 'center',
        width: OVERLAY_WIDTH * 0.6,
    },
    overlayHeader: {
        alignItems: 'center',
        height: (OVERLAY_HEIGHT * 1100) / 2655,
        justifyContent: 'center',
    },
    overlayImage: {
        marginTop: PxFit(-50),
        height: OVERLAY_HEIGHT,
        paddingTop: (OVERLAY_HEIGHT * 510) / 2655,
        width: OVERLAY_WIDTH,
    },
    whiteText1: {
        color: '#fff',
        fontSize: PxFit(18),
        fontWeight: 'bold',
        paddingBottom: PxFit(5),
    },
    whiteText2: {
        color: '#fff',
        fontSize: PxFit(16),
    },
});

export default SignedReturn;
