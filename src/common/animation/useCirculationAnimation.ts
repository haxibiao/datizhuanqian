import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

interface Props {
    duration: number;
    start: boolean;
}

export const useCirculationAnimation = (props: Props) => {
    const { duration, start } = props;
    const animation = useRef(new Animated.Value(1));
    const runAnimation = useCallback(() => {
        animation.current.setValue(0);
        Animated.timing(animation.current, {
            toValue: 1,
            duration,
            easing: Easing.linear,
        }).start(() => runAnimation());
    }, [duration]);

    useEffect(() => {
        if (start) {
            runAnimation();
        }
        return () => {
            animation.current.stopAnimation();
        };
    }, [start]);

    return animation.current;
};
