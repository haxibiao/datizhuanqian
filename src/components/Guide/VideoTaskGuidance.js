import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { PxFit, Theme, SCREEN_WIDTH, NAVBAR_HEIGHT, SCREEN_HEIGHT, Tools } from 'utils';

function VideoTaskGuidance({ onDismiss }) {
    const [step, setStep] = useState(0);
    const guidesView = useMemo(() => {
        switch (step) {
            case 0:
                return (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Tools.navigate('提现');
                            setStep(1);
                        }}
                    >
                        <Image style={styles.userReward} source={require('../../assets/images/new_user_reward.png')} />
                    </TouchableWithoutFeedback>
                );
                break;
            case 1:
                return (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Tools.navigate('任务');
                            setStep(2);
                        }}
                    >
                        <View style={styles.flexCenter}>
                            <Image
                                style={styles.withdrawGuide}
                                source={require('../../assets/images/withdraw_guide.png')}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                );
                break;
            case 2:
                return (
                    <TouchableWithoutFeedback onPress={onDismiss}>
                        <View style={styles.flexCenter}>
                            <Image
                                style={styles.stimulateVideo}
                                source={require('../../assets/images/stimulate_video.png')}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                );
                break;
        }
    }, [step]);

    return guidesView;
}

const WITHDRAW_IMAGE_WIDTH = ((SCREEN_WIDTH - PxFit(Theme.itemSpace * 3)) * 764) / 450;
const TASK_IMAGE_WIDTH = SCREEN_WIDTH - PxFit(Theme.itemSpace * 2);

const withdrawGuideTop = PxFit(52) + PxFit(Theme.itemSpace) * 2 + PxFit(NAVBAR_HEIGHT) + PxFit(Theme.statusBarHeight);
const withdrawGuideRight = (SCREEN_WIDTH / 2 - 120) / 2;

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userReward: {
        width: (SCREEN_WIDTH * 4) / 5,
        height: (((SCREEN_WIDTH * 4) / 5) * 640) / 519,
        resizeMode: 'contain'
    },
    withdrawGuide: {
        position: 'absolute',
        top: withdrawGuideTop,
        right: withdrawGuideRight,
        width: WITHDRAW_IMAGE_WIDTH,
        height: (WITHDRAW_IMAGE_WIDTH * 659) / 746,
        resizeMode: 'contain'
    },
    stimulateVideo: {
        position: 'absolute',
        top: PxFit(NAVBAR_HEIGHT) + PxFit(Theme.statusBarHeight),
        right: PxFit(Theme.itemSpace),
        width: TASK_IMAGE_WIDTH,
        height: (TASK_IMAGE_WIDTH * 423) / 800,
        resizeMode: 'contain'
    }
});

export default VideoTaskGuidance;
