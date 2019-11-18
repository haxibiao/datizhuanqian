/*
 * @flow
 * created by wyk made in 2019-09-09 11:10:28
 */
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { PxFit, Theme, SCREEN_WIDTH, NAVBAR_HEIGHT, SCREEN_HEIGHT, Tools } from 'utils';
import { app } from 'store';
import { ttad } from 'native';
import { playVideo } from 'common';

function VideoGuidance({ onDismiss }) {
    const [step, setStep] = useState(0);
    const me = useMemo(() => app.me, [app]);
    const guidesView = useMemo(() => {
        return [
            <TouchableWithoutFeedback
                key={1}
                onPress={() => {
                    setStep(1);
                }}>
                <View style={styles.flexCenter}>
                    <Image style={styles.answerGuide} source={require('../../assets/images/video_guide_1.gif')} />
                </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback
                key={2}
                onPress={() => {
                    app.changeUserStatus(false);
                    onDismiss();
                }}>
                <View style={styles.flexCenter}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            app.changeUserStatus(false);
                            playVideo({ type: 'Guide' });
                            onDismiss();
                        }}>
                        <Image
                            style={styles.stimulateVideo}
                            source={require('../../assets/images/video_guide_2.png')}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>,
        ];
    }, []);

    return guidesView[step];
}

const videoGuideWidth = PxFit(88) * (800 / 252);
const videoGuideHeight = (videoGuideWidth * 442) / 931;
const videoGuideBottom = PxFit(340 + Theme.HOME_INDICATOR_HEIGHT);

const WIDTH = SCREEN_WIDTH / 2;
const HEIGHT = (WIDTH * 1026) / 772;

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerGuide: {
        width: WIDTH,
        height: HEIGHT,
        resizeMode: 'contain',
    },
    userReward: {
        width: (SCREEN_WIDTH * 4) / 5,
        height: (((SCREEN_WIDTH * 4) / 5) * 640) / 519,
        resizeMode: 'contain',
    },
    stimulateVideo: {
        position: 'absolute',
        bottom: videoGuideBottom,
        right: PxFit(Theme.itemSpace),
        width: videoGuideWidth,
        height: videoGuideHeight,
        resizeMode: 'contain',
    },
});

export default VideoGuidance;
