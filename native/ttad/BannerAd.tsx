import React, { useState } from 'react';
import { Platform, StyleSheet, requireNativeComponent, Dimensions } from 'react-native';
import { SCREEN_WIDTH } from '../../src/utils';

const NativeBannerAd = requireNativeComponent('BannerAd');

interface Props {
    adWidth: number;
    onError?: Function;
    onLoad?: Function;
}

let codeid = Platform.OS === 'android' ? '916518401' : '';

const BannerAd = (props: Props) => {
    let { adWidth = SCREEN_WIDTH - 30, onError, onLoad } = props;
    let [visible, setVisible] = useState(true);
    let [height, setHeight] = useState(0); //默认高度

    if (!visible) return null;
    return (
        <NativeBannerAd
            codeid={codeid} //ios ?
            adWidth={adWidth}
            style={{ ...styles.container, height }}
            onError={e => {
                console.log('onError', e.nativeEvent);
                onError && onError(e.nativeEvent);
                setVisible(false);
            }}
            onAdClosed={e => {
                console.log('onAdClosed', e.nativeEvent);
                setVisible(false);
            }}
            onLayoutChanged={e => {
                console.log('onLayoutChanged', e.nativeEvent);
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

export default BannerAd;
