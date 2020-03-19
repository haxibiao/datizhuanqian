import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useCirculationAnimation } from '@src/common/animation';

const trackHeight = [2, 4, 6, 3, 3, 5, 2, 6, 3, 3, 2, 2, 10, 2, 4, 6, 3, 3, 6, 2, 7, 2, 2, 7, 9, 6];

export const Track = ({ style, distance, children }) => {
    const animation = useCirculationAnimation({ delay: Math.random() > 0.5 ? 2000 : 0, duration: 2000, start: true });
    const translateY = animation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [0, -PxFit(distance), 0, PxFit(distance), 0],
    });
    return <Animated.View style={[style, { transform: [{ translateY }] }]}>{children}</Animated.View>;
};

export const AnimatedTracks = ({ style, maxWidth, multiple = PxFit(1) }) => {
    const renderAudioTrack = useMemo(() => {
        return Array(Math.floor(maxWidth / (multiple * 3)))
            .fill(1)
            .map((ele, index) => {
                const height = PxFit(multiple * trackHeight[index % trackHeight.length]);
                const trackStyle = {
                    marginHorizontal: multiple,
                    width: multiple,
                    height,
                    backgroundColor: '#b997ff',
                    opacity: 0.7,
                };
                return <Track style={trackStyle} distance={Math.max(1, height / 4)} key={index} />;
            });
    }, []);

    return <View style={[styles.row, style]}>{renderAudioTrack}</View>;
};

export default ({ multiple = PxFit(1), currentTime, duration }) => {
    const [maxWidth, setMaxWidth] = useState(0);
    const onLayout = useCallback(event => {
        if (Helper.syncGetter('nativeEvent.layout.width', event)) {
            setMaxWidth(Math.floor(Helper.syncGetter('nativeEvent.layout.width', event)));
        }
    }, []);
    const renderAudioTrack = useMemo(() => {
        if (maxWidth > 0) {
            return Array(Math.floor(maxWidth / (multiple * 3)))
                .fill(1)
                .map((ele, index) => {
                    const trackStyle = {
                        marginHorizontal: multiple,
                        width: multiple,
                        height: PxFit(multiple * trackHeight[index % trackHeight.length]),
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
