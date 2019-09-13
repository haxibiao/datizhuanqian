import React from 'react';
import { StyleSheet } from 'react-native';
import NativeBannerAd from './NativeBannerAd';
import { SCREEN_WIDTH } from 'utils';

const BannerAd = ({ size }) => {
    let style = styles.large;
    if (size === 'middle') {
        style = styles.middle;
    }
    if (size === 'small') {
        style = styles.small;
    }
    return <NativeBannerAd codeid="916518401" size={size} style={style} />;
};

const styles = StyleSheet.create({
    large: {
        height: 80,
        width: SCREEN_WIDTH,
    },
    middle: {
        height: 70,
        width: SCREEN_WIDTH,
    },
    small: {
        height: 60,
        width: SCREEN_WIDTH,
    },
});

export default BannerAd;
