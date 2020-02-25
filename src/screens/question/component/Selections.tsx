import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Animated } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from '@src/utils';
import { Iconfont } from '@src/components';
import { useLinearAnimation } from '@src/common';
import { observer } from '@src/screens/answer/store';
import SelectionItem from './SelectionItem';

export default observer(({ store, question }) => {
    const selections = useMemo(() => question.selections_array, [question]);
    const animations = useRef(
        selections.map(() => new Animated.Value(0)),
        [selections],
    ).current;
    const stopPropagation = useRef(true);
    useEffect(() => {
        stopPropagation.current = true;
        Animated.parallel(
            animations.map(animation => {
                return Animated.timing(animation, {
                    toValue: 1,
                    velocity: 10,
                    tension: -10,
                    friction: 5,
                    delay: 350,
                });
            }),
        ).start(() => {
            stopPropagation.current = false;
        });
    }, []);

    const createAnimate = useCallback((animation, order) => {
        return {
            opacity: animation,
            transform: [
                {
                    translateX: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [order % 2 === 0 ? -SCREEN_WIDTH : SCREEN_WIDTH, 0],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };
    }, []);

    return useMemo(() => {
        return (
            <View onStartShouldSetResponder={event => stopPropagation.current}>
                {selections.map((option, index) => {
                    return (
                        <Animated.View style={createAnimate(animations[index], index)} key={option + index}>
                            <SelectionItem
                                question={question}
                                store={store}
                                value={option.Value}
                                text={option.Text}
                                style={{ marginBottom: PxFit(20) }}
                            />
                        </Animated.View>
                    );
                })}
            </View>
        );
    }, [selections, animations]);
});
