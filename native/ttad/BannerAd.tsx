import React, { useState } from 'react';
import { StyleSheet, requireNativeComponent } from 'react-native';
const NativeBannerAd = requireNativeComponent('BannerAd');
import { SCREEN_WIDTH } from 'utils';

type BannerSize = 'small' | 'large';
type Props = {
    size: BannerSize;
};

const BannerAd = (props: Props) => {
    let { size } = props;
    let [visible, setVisible] = useState(true);
    let [height, setHeight] = useState(80); //默认高度
    return (
        visible && (
            <NativeBannerAd
                codeid="916518401"
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
