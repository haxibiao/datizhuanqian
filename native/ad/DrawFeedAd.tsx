import React, { useState, useEffect } from 'react';
import { StyleSheet, requireNativeComponent, Dimensions, Platform } from 'react-native';
const { width } = Dimensions.get('window');
const NativeDrawFeedAd = requireNativeComponent('DrawFeedAd');

import { CodeIdDrawFeed, CodeIdDrawFeedIOS } from '@app/app.json';

const codeid = Platform.OS === 'ios' ? CodeIdDrawFeedIOS : CodeIdDrawFeed;

type Props = {
    onError?: Function;
    onAdShow?: Function;
    onAdClick?: Function;
};

const DrawFeedAd = (props: Props) => {
    let { onError, onAdShow, onAdClick } = props;
    let [visible, setVisible] = useState(true);
    const [time, setTime] = useState(0);

    if (!visible) return null;
    return (
        <NativeDrawFeedAd
            codeid={codeid}
            is_express={'false'}
            style={{ ...styles.container }}
            onError={e => {
                console.log('onError feed', e.nativeEvent);
                setVisible(false);
                onError && onError(e.nativeEvent);
            }}
            onAdClick={e => {
                console.log('onClick', e.nativeEvent);
                onAdClick && onAdClick();
            }}
            onAdShow={e => {
                console.log('onAdShow', e.nativeEvent);
                onAdShow && onAdShow();
            }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        flex: 1,
    },
});

export default DrawFeedAd;
