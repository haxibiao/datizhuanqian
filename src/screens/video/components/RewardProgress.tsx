import React from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native';
import { observer } from 'store';
import { PxFit, Tools } from '../../../utils';
import * as Progress from 'react-native-progress';
import VideoStore from '../VideoStore';

const RewardProgress = observer(props => {
    const progress = (VideoStore.progress / VideoStore.rewardLimit) * 100;
    console.log('====================================');
    console.log('progress', progress);
    console.log('====================================');
    return (
        <TouchableWithoutFeedback onPress={(): void => Tools.navigate('Withdraw')}>
            <View style={styles.circleProgress}>
                <Image source={require('@src/assets/images/video_reward_progress.png')} style={styles.videoReward} />
                <Progress.Circle
                    progress={progress / 100}
                    size={PxFit(60)}
                    borderWidth={0}
                    color="#ff5644"
                    fill="#fff"
                    thickness={PxFit(4)}
                    endAngle={1}
                    strokeCap={'round'}
                />
            </View>
        </TouchableWithoutFeedback>
    );
});
const styles = StyleSheet.create({
    circleProgress: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: PxFit(30),
        height: PxFit(60),
        justifyContent: 'center',
        position: 'relative',
        width: PxFit(60),
    },
    videoReward: {
        ...StyleSheet.absoluteFill,
        height: null,
        width: null,
    },
});

export default RewardProgress;
