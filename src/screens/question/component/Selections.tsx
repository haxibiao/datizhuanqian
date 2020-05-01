import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { View, Animated } from 'react-native';
import { observer } from '@src/screens/answer/store';
import SelectionItem from './SelectionItem';
import AuditSelectionItem from './AuditSelectionItem';

export default observer(({ store, question, audit }) => {
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
                        outputRange: [order % 2 === 0 ? -Device.WIDTH : Device.WIDTH, 0],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };
    }, []);

    return useMemo(() => {
        return (
            <View onStartShouldSetResponder={() => stopPropagation.current}>
                {selections.map((option, index) => {
                    return (
                        <Animated.View style={createAnimate(animations[index], index)} key={option + index}>
                            {audit ? (
                                <AuditSelectionItem
                                    question={question}
                                    store={store}
                                    value={option.Value}
                                    text={option.Text}
                                    style={{ marginBottom: PxFit(20) }}
                                />
                            ) : (
                                <SelectionItem
                                    question={question}
                                    store={store}
                                    value={option.Value}
                                    text={option.Text}
                                    style={{ marginBottom: PxFit(20) }}
                                />
                            )}
                        </Animated.View>
                    );
                })}
            </View>
        );
    }, [selections, animations]);
});
