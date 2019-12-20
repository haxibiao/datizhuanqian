import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

interface Props {
    delay: number;
    duration: number;
    start: boolean;
}

export const useCirculationAnimation = (props: Props) => {
    const { delay, duration, start } = props;

    const animation = useRef(new Animated.Value(1));
    const runAnimation = useCallback(() => {
        Animated.sequence([
            Animated.delay(delay || 0),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animation.current, {
                        toValue: 0,
                        duration: 1,
                    }),
                    Animated.timing(animation.current, {
                        toValue: 1,
                        duration,
                        easing: Easing.linear,
                    }),
                ]),
            ),
        ]).start();
    }, [duration]);

    useEffect(() => {
        if (start) {
            runAnimation();
        } else {
            animation.current.stopAnimation();
        }
        return () => {
            animation.current.stopAnimation();
        };
    }, [start]);

    return animation.current;
};
