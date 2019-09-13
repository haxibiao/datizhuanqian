import React from 'react';
import { StyleSheet } from 'react-native';
import NativeFeedAd from './NativeFeedAd';
import { SCREEN_WIDTH } from 'utils';

const FeedAd = ({ size }) => {
    // 916518830 自渲染
    // 916518779 模板渲染
    let style = styles.large;
    if (size === 'middle') {
        style = styles.middle;
    }
    if (size === 'small') {
        style = styles.small;
    }
    return <NativeFeedAd codeid="916518830" size={size} style={style} />;
};

const styles = StyleSheet.create({
    large: {
        height: 250,
        width: SCREEN_WIDTH,
    },
    middle: {
        height: 200,
        width: SCREEN_WIDTH,
    },
    small: {
        height: 150,
        width: SCREEN_WIDTH,
    },
});

export default FeedAd;
