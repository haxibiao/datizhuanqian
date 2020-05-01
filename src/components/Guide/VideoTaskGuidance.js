/*
 * @flow
 * created by wyk made in 2019-09-09 11:10:28
 */
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';

import { app } from 'store';

function VideoTaskGuidance({ onDismiss }) {
    const [step, setStep] = useState(0);
    const me = useMemo(() => app.me, [app]);
    const guidesView = useMemo(() => {
        return [
            <TouchableWithoutFeedback
                key={1}
                onPress={() => {
                    setStep(1);
                }}>
                <Image style={styles.userReward} source={require('@src/assets/images/bg_new_user_reward.png')} />
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback
                key={2}
                onPress={() => {
                    // Helper.middlewareNavigate('任务');
                    onDismiss();
                }}>
                <View style={styles.flexCenter}>
                    <Image
                        style={styles.answerGuide}
                        source={require('@src/assets/images/bg_new_user_home_guidance.png')}
                    />
                </View>
            </TouchableWithoutFeedback>,
            // <TouchableWithoutFeedback
            //     key={3}
            //     onPress={() => {
            //         app.changeUserStatus(false);
            //         onDismiss();
            //     }}>
            //     <View style={styles.flexCenter}>
            //         <TouchableWithoutFeedback
            //             onPress={() => {
            //                 app.changeUserStatus(false);
            //                 // playVideo({ type: 'Task' });
            //                 onDismiss();
            //             }}>
            //             <Image
            //                 style={styles.stimulateVideo}
            //                 source={require('../../assets/images/stimulate_video.png')}
            //             />
            //         </TouchableWithoutFeedback>
            //     </View>
            // </TouchableWithoutFeedback>,
        ];
    }, []);

    return guidesView[step];
}

const withdrawGuideTop = PxFit(54) + Device.NAVBAR_HEIGHT;
const withdrawGuideRight = (Device.WIDTH / 2 - 120) / 2;
const withdrawGuideWidth = Device.WIDTH * 0.88;

const videoTaskGuideWidth = PxFit(88) * (800 / 252);
const videoTaskGuideHeight = (videoTaskGuideWidth * 423) / 800;
const videoTaskGuideTop =
    PxFit(265) + PxFit(Device.NAVBAR_HEIGHT) + PxFit(Device.statusBarHeight) - (videoTaskGuideHeight * 326) / 423;

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userReward: {
        width: (Device.WIDTH * 3) / 5,
        height: (((Device.WIDTH * 3) / 5) * 688) / 478,
        resizeMode: 'contain',
    },
    answerGuide: {
        position: 'absolute',
        top: withdrawGuideTop,
        left: 8,
        width: withdrawGuideWidth,
        height: (withdrawGuideWidth * 762) / 840,
        resizeMode: 'contain',
    },
    stimulateVideo: {
        position: 'absolute',
        top: videoTaskGuideTop,
        right: PxFit(48),
        width: videoTaskGuideWidth,
        height: videoTaskGuideHeight,
        resizeMode: 'contain',
    },
});

export default VideoTaskGuidance;
