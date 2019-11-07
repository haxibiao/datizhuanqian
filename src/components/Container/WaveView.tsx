import React, { useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
const timing = Animated.timing;

const WaveView = props => {
    const { containerStyle, style } = props;
    const scale = useRef(new Animated.Value(1));
    const opacity = useRef(new Animated.Value(1));
    const scale2 = useRef(new Animated.Value(1));
    const opacity2 = useRef(new Animated.Value(1));

    const startAnimation = useCallback(() => {
        Animated.stagger(1000, [
            Animated.loop(
                Animated.parallel([
                    timing(scale.current, {
                        toValue: 2,
                        duration: 3000,
                    }),
                    timing(opacity.current, {
                        toValue: 0,
                        duration: 3000,
                    }),
                ]),
            ),
            Animated.loop(
                Animated.parallel([
                    timing(scale2.current, {
                        toValue: 2,
                        duration: 3000,
                    }),
                    timing(opacity2.current, {
                        toValue: 0,
                        duration: 3000,
                    }),
                ]),
            ),
        ]).start(() => {});
    }, []);

    useEffect(() => {
        startAnimation();
    }, []);

    return (
        <View style={containerStyle}>
            <Animated.View
                style={[
                    styles.ripple,
                    {
                        opacity: opacity.current,
                        transform: [{ scale: scale.current }],
                    },
                    style,
                ]}
            />
            <Animated.View
                style={[
                    styles.ripple,
                    {
                        opacity: opacity2.current,
                        transform: [{ scale: scale2.current }],
                    },
                    style,
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    ripple: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
});

export default WaveView;
