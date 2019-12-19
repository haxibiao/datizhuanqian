import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Theme, PxFit, Tools } from '../../utils';

const trackHeight = [1, 3, 5, 2, 2, 4, 1, 4, 2, 2, 1, 1, 8, 1, 3, 5, 2, 2, 4, 1, 4, 1, 1, 5, 9, 5];

const AudioTrack = ({ trackWidth = PxFit(1), currentTime, duration }) => {
    const [maxWidth, setMaxWidth] = useState(0);
    const onLayout = useCallback(event => {
        if (Tools.syncGetter('nativeEvent.layout.width', event)) {
            setMaxWidth(Tools.syncGetter('nativeEvent.layout.width', event));
        }
    }, []);
    const renderAudioTrack = useMemo(() => {
        // const inactiveStyle = {
        //     backgroundColor: '#fff',
        //     opacity: 0.5,
        // };
        // const activeStyle = {
        //     backgroundColor: '#F7DC6F',
        // };
        if (maxWidth > 0) {
            return Array(Math.floor(maxWidth / (trackWidth * 3)))
                .fill(1)
                .map((ele, index) => {
                    const trackStyle = {
                        marginHorizontal: trackWidth,
                        width: trackWidth,
                        height: PxFit(trackHeight[index % trackHeight.length]),
                        backgroundColor: '#fff',
                        opacity: 0.5,
                    };
                    return <View style={trackStyle} key={index} />;
                });
        }
    }, [maxWidth]);

    const progress = (currentTime / duration) * 100;

    return (
        <View style={styles.container} onLayout={onLayout}>
            <View style={styles.track}>{renderAudioTrack}</View>
            <View style={[styles.ops, { width: progress + '%' }]}>
                <LinearGradient
                    style={styles.gradient}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 0.5, y: 1 }}
                    locations={[0, 1]}
                    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.4)']}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    track: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ops: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
    },
    gradient: {
        ...StyleSheet.absoluteFill,
    },
});

export default AudioTrack;
