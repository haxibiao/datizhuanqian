import React, { useState } from 'react';
import { StyleSheet, requireNativeComponent, Dimensions } from 'react-native';
import { SCREEN_WIDTH } from '../../src/utils';
import { config } from 'store';
const NativeFeedAd = requireNativeComponent('FeedAd');

interface Props {
    adWidth: number;
    onError?: Function;
    onLoad?: Function;
}

const FeedAd = (props: Props) => {
    const { adWidth = SCREEN_WIDTH - 30, onError, onLoad } = props;
    let [visible, setVisible] = useState(true);
    let [height, setHeight] = useState(0); //默认高度
    // 916518830 自渲染不屏蔽
    // 916518779 自渲染屏蔽成人保健
    // 916518115 Express模板渲染
    const disableAd = config.disableAd;
    if (!visible || disableAd) return null;
    return (
        <NativeFeedAd
            codeid="916518115"
            adWidth={adWidth}
            style={{ ...styles.container, height }}
            onError={e => {
                console.log('onError feed', e.nativeEvent);
                setVisible(false);
                onError && onError(e.nativeEvent);
            }}
            onAdClosed={e => {
                console.log('onAdClosed', e.nativeEvent);
                setVisible(false);
            }}
            onLayoutChanged={e => {
                console.log('onLayoutChanged feed', e.nativeEvent);
                if (e.nativeEvent.height) {
                    setHeight(e.nativeEvent.height);
                    onLoad && onLoad(e.nativeEvent);
                }
            }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: 0,
    },
});

export default FeedAd;
