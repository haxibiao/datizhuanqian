import React, { useState } from 'react';
import { Platform, StyleSheet, requireNativeComponent, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import { SCREEN_WIDTH } from 'utils';
import { config } from 'store';
const NativeBannerAd = requireNativeComponent('BannerAd');

let codeid = Platform.OS === 'android' ? '916518401' : ''; //TODO: ios上架后更新ios的
interface Props {
    adWidth: number;
    onAdClicked?: Function;
    onAdClosed?: Function;
    onAdShow?: Function;
    onError?: Function;
}

const BannerAd = (props: Props) => {
    let { adWidth = width - 30, onError, onAdShow, onAdClosed, onAdClicked } = props;
    let [visible, setVisible] = useState(true);
    let [height, setHeight] = useState(Platform.OS === 'android' ? 0 : 40); //默认高度

    const disableAd = config.disableAd;
    if (!visible || disableAd) return null;
    return (
        <NativeBannerAd
            codeid={codeid} //ios ?
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
        width: SCREEN_WIDTH, //很奇怪  Dimensions.get('window') 和SCREEN_WIDTH 值一样  但是使用前者时广告会溢出
        height: 0,
    },
});

export default BannerAd;
