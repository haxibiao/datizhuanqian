/*
 * @flow
 * created by wyk made in 2019-09-09 11:10:28
 */
import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native';

import { app } from 'store';

function VideoGuidance({ onDismiss }) {
    const [step, setStep] = useState(0);
    const guidesView = useMemo(() => {
        return [
            <TouchableWithoutFeedback
                key={1}
                onPress={() => {
                    setStep(1);
                }}>
                <View style={styles.flexCenter}>
                    <Image
                        style={styles.answerGuide}
                        source={require('@src/assets/images/bg_video_guidance_one.png')}
                    />
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
                            // playVideo({ type: 'Guide' });
                            onDismiss();
                        }}>
                        <Image
                            style={styles.stimulateVideo}
                            source={require('@src/assets/images/bg_video_guidance_two.png')}
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
const videoGuideBottom = PxFit(380 + Device.HOME_INDICATOR_HEIGHT);

const WIDTH = Device.WIDTH / 2;
const HEIGHT = (WIDTH * 1026) / 772;

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerGuide: {
        width: WIDTH,
        height: HEIGHT,
        resizeMode: 'contain',
    },
    userReward: {
        width: (Device.WIDTH * 4) / 5,
        height: (((Device.WIDTH * 4) / 5) * 640) / 519,
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
