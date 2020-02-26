import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Overlay } from 'teaset';

let OverlayKey: any = null;

export const show = (props: Props) => {
    const overlayView = (
        <Overlay.View animated>
            <View style={styles.container}></View>
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};
export const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default { show, hide };
