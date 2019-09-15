import React, { useState } from 'react';
import { StyleSheet, requireNativeComponent } from 'react-native';
const NativeFeedAd = requireNativeComponent('FeedAd');
import { SCREEN_WIDTH } from 'utils';

type FeedSize = 'small' | 'large';
type Props = {
    size: FeedSize;
};

const FeedAd = (props: Props) => {
    let { size } = props;
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
                onError={e => {
                    console.log('onError', e.nativeEvent);
                    setVisible(false);
                }}
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
