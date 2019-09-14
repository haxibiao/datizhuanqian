import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import NativeFeedAd from './NativeFeedAd';
import { SCREEN_WIDTH } from 'utils';

const FeedAd = ({ size }) => {
    let [visible, setVisible] = useState(true);
    let [height, setHeight] = useState(160); //默认高度
    // 916518830 自渲染不屏蔽
    // 916518779 自渲染屏蔽成人保健
    // 916518115 Express模板渲染
    return (
        visible && (
            <NativeFeedAd
                codeid="916518115"
                size={size}
                style={{ ...styles.container, height }}
                onAdClosed={e => {
                    console.log('onAdClosed', e.nativeEvent);
                    setVisible(false);
                }}
                onLayoutChanged={e => {
                    console.log('onLayoutChanged', e.nativeEvent);
                    if (e.nativeEvent.height > 0) {
                        setHeight(e.nativeEvent.height);
                    }
                }}
            />
        )
    );
};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: 160,
    },
});

export default FeedAd;
