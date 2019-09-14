import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import NativeBannerAd from './NativeBannerAd';
import { SCREEN_WIDTH } from 'utils';

const BannerAd = ({ size }) => {
    let [visible, setVisible] = useState(true);
    // let height = size === 'small' ? 80 : 120;
    let [height, setHeight] = useState(80); //默认高度
    return (
        visible && (
            <NativeBannerAd
                codeid="916518401"
                size={size}
                style={{ ...styles.container, height }}
                onAdClosed={e => {
                    console.log('onAdClosed', e.nativeEvent);
                    setVisible(false);
                }}
                onLayoutChanged={e => {
                    console.log('onLayoutChanged', e.nativeEvent);
                    setHeight(e.nativeEvent.height);
                }}
            />
        )
    );
};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: 80,
    },
});

export default BannerAd;
