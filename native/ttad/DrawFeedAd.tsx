import React, { useState, useEffect } from 'react';
import { StyleSheet, requireNativeComponent, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
const NativeDrawFeedAd = requireNativeComponent('DrawFeedAd');

type Props = {
    onError?: Function;
    onAdShow?: Function;
};

// 内测 无论android ios 都可以用 下面的appid, codeid;
// 5016582;

// 内测_Draw信息流;
// 916582757;
// 内测_信息流;
// 916582486;
// 内测_Banner;
// 916582063;

const DrawFeedAd = (props: Props) => {
    let { onError, onAdShow } = props;
    let [visible, setVisible] = useState(true);
    const [time, setTime] = useState(0);

    if (!visible) return null;
    return (
        <NativeDrawFeedAd
            codeid="916518247"
            style={{ ...styles.container }}
            onError={e => {
                console.log('onError feed', e.nativeEvent);
                setVisible(false);
                onError && onError(e.nativeEvent);
            }}
            onAdClick={e => {
                console.log('onClick', e.nativeEvent);
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
