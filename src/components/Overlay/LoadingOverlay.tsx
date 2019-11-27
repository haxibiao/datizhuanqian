/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
import React, { Fragment } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from 'react-native';

import { Overlay } from 'teaset';

const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

interface Props {
    content?: string;
    style?: any;
}

class LoadingOverlay {
    static OverlayKey: any;
    static show(props: Props) {
        const { style, content } = props;

        const overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={[styles.uploading, style]}>
                        <View style={styles.body}>
                            <ActivityIndicator color="#fff" size={'small'} />
                            <Text style={styles.text}>{content || `loading...`}</Text>
                        </View>
                    </View>
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
    }

    static hide() {
        Overlay.hide(this.OverlayKey);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploading: {
        // backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        width: SCREEN_WIDTH / 4,
        height: SCREEN_WIDTH / 4,
        backgroundColor: 'rgba(32,30,51,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    text: {
        fontSize: 13,
        color: '#FFF',
        textAlign: 'center',
        paddingTop: 8,
    },
});

export default LoadingOverlay;
