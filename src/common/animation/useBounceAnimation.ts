import React, {useState, useEffect, useRef} from 'react';
import {Animated} from 'react-native';

export const useBounceAnimation = (isStart: boolean) => {
    const animation = new Animated.Value(1);
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
        } else {
            Animated.spring(animation, {
                toValue: 1.2,
                friction: 2,
                tension: 40,
            }).start();
        }
    }, [isStart]);
    return animation;
};
