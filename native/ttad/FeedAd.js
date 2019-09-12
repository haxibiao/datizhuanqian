import React from 'react';
import { StyleSheet } from 'react-native';
import NativeFeedAd from './NativeFeedAd';
import { SCREEN_WIDTH } from 'utils';

const FeedAd = ({ size }) => {
    return <NativeFeedAd codeid="916518779" size={size} style={styles.Feed} />;
};

const styles = StyleSheet.create({
    Feed: {
        height: 250, // 后面根据 size 调整下
        width: SCREEN_WIDTH,
    },
});

export default FeedAd;
