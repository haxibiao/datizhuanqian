import React from 'react';
import { StyleSheet } from 'react-native';
import NativeBannerAd from './NativeBannerAd';
import { SCREEN_WIDTH } from 'utils';

const BannerAd = ({ size }) => {
    return <NativeBannerAd codeid="916518401" size={size} style={styles.banner} />;
};

const styles = StyleSheet.create({
    banner: {
        height: 80, //  好像banner 都不高, 后面根据 size 调整下
        width: SCREEN_WIDTH,
    },
});

export default BannerAd;
