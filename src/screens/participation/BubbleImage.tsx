import React from 'react';
import { StyleSheet, Animated, Image } from 'react-native';
import { useCirculationAnimation } from '@src/common';
import { PxFit } from '@src/utils';

const BubbleImage = props => {
    const { value } = props;
    const animation = useCirculationAnimation({ duration: 2000, start: true });
    const translateY = animation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, -PxFit(5), 0, PxFit(5), 0],
    });
    let image = require('@src/assets/images/reward_bubble.png');
    if (value) {
        image = require('@src/assets/images/rmb_bubble.png');
    }
    return (
        <Animated.View style={{ transform: [{ translateY }] }}>
            <Image source={image} style={styles.rewardBubble} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    rewardBubble: {
        alignItems: 'center',
        height: PxFit(50),
        justifyContent: 'center',
        width: PxFit(50),
    },
    rewardText: {
        color: '#fff',
        fontSize: PxFit(14),
    },
});

export default BubbleImage;
