/*
 * @flow
 * created by wyk made in 2019-09-12 11:19:10
 */
'use strict';

import React, { useMemo, useCallback, useState, useLayoutEffect, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH, ISIOS, Tools, WPercent } from 'utils';
import { ttad } from 'native';
import { app } from 'store';

type Props = {
    gold: number,
    reward: number,
};

const SignedReturn = (props: Props) => {
    const { gold, reward } = props;
    const me = useMemo(() => app.me, [app]);

    const overlayRef = useRef();

    const loadAd = useCallback(() => {
        ttad.RewardVideo.loadAd({ ...me.adinfo, uid: me.id }).then(() => {
            // 开始看奖励视频
            ttad.RewardVideo.startAd({
                ...me.adinfo,
                uid: me.id,
            });
        });
    }, []);

    return (
        <ImageBackground style={styles.overlayImage} source={require('../../../assets/images/attendance_overlay.png')}>
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
            <View style={styles.TTAD}>
                <View style={styles.bannerAd}>
                    <ttad.BannerAd size="small" />
                </View>
                <TouchableWithoutFeedback onPress={loadAd}>
                    <ImageBackground
                        style={styles.loadAdButton}
                        source={require('../../../assets/images/attendance_button.png')}>
                        <Text style={styles.buttonText}>获取双倍奖励</Text>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            </View>
        </ImageBackground>
    );
};

const OVERLAY_WIDTH = WPercent(80);
const OVERLAY_HEIGHT = (OVERLAY_WIDTH * 2655) / 1819;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    overlayImage: {
        width: OVERLAY_WIDTH,
        height: OVERLAY_HEIGHT,
        paddingTop: (OVERLAY_HEIGHT * 510) / 2655,
        paddingHorizontal: OVERLAY_WIDTH * 0.1,
    },
    overlayHeader: {
        height: (OVERLAY_HEIGHT * 1100) / 2655,
        justifyContent: 'center',
        alignItems: 'center',
    },
    whiteText1: {
        fontSize: PxFit(18),
        color: '#fff',
        fontWeight: 'bold',
        paddingBottom: PxFit(5),
    },
    whiteText2: {
        fontSize: PxFit(16),
        color: '#fff',
    },
    highlightText: {
        fontWeight: 'bold',
        color: '#FFCC01',
    },
    TTAD: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    bannerAd: {
        alignSelf: 'stretch',
    },
    loadAdButton: {
        width: OVERLAY_WIDTH * 0.6,
        height: (OVERLAY_WIDTH * 0.6 * 258) / 995,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: PxFit(16),
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default SignedReturn;
