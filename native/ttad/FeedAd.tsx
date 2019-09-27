import React, { useState } from 'react';
import { StyleSheet, requireNativeComponent, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import { SCREEN_WIDTH } from 'utils';
import { config } from 'store';
const NativeFeedAd = requireNativeComponent('FeedAd');

let codeid = '916518115'; //TODO: ios上架后更新ios的
interface Props {
    adWidth: number;
    onAdClicked?: Function;
    onAdClosed?: Function;
    onAdShow?: Function;
    onError?: Function;
}

const FeedAd = (props: Props) => {
    let { adWidth = width - 30, onError, onAdShow, onAdClosed, onAdClicked } = props;
    let [visible, setVisible] = useState(true);
    let [height, setHeight] = useState(0); //默认高度
    const disableAd = config.disableAd;
    if (!visible || disableAd) return null;
    return (
        <NativeFeedAd
            codeid={codeid}
            adWidth={adWidth}
            style={{ ...styles.container, height }}
            onAdClicked={(e: { nativeEvent: any }) => {
                onAdClicked && onAdClicked(e.nativeEvent);
            }}
            onError={(e: { nativeEvent: any }) => {
                console.log('onError', e.nativeEvent);
                onError && onError(e.nativeEvent);
                setVisible(false);
            }}
            onAdClosed={(e: { nativeEvent: any }) => {
                console.log('onAdClosed', e.nativeEvent);
                onAdClosed && onAdClosed(e.nativeEvent);
                setVisible(false);
            }}
            onLayoutChanged={(e: { nativeEvent: { height: React.SetStateAction<number> } }) => {
                console.log('onLayoutChanged', e.nativeEvent);
                if (e.nativeEvent.height) {
                    setHeight(e.nativeEvent.height);
                    onAdShow && onAdShow(e.nativeEvent);
                } else {
                    setVisible(false);
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
