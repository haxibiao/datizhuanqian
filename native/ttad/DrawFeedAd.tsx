import React, { useState } from 'react';
import { StyleSheet, requireNativeComponent } from 'react-native';
const NativeDrawFeedAd = requireNativeComponent('DrawFeedAd');
import { SCREEN_WIDTH, PxFit } from 'utils';

type Props = {
    onError?: Function;
    onLoad?: Function;
};

const DrawFeedAd = (props: Props) => {
    let { onError, onLoad } = props;
    let [visible, setVisible] = useState(true);
    return (
        visible && (
            <NativeDrawFeedAd
                codeid="916518247"
                style={{ ...styles.container }}
                onError={e => {
                    console.log('onError feed', e.nativeEvent);
                    setVisible(false);
                    onError && onError(e.nativeEvent);
                }}
                onTitleClick={e => {
                    console.log('onTitleClick', e.nativeEvent);
                }}
                onDownloadClick={e => {
                    console.log('onDownloadClick', e.nativeEvent);
                }}
                onAdShow={e => {
                    console.log('onAdShow', e.nativeEvent);
                }}
            />
        )
    );
};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        flex: 1,
    },
});

export default DrawFeedAd;
