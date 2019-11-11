import { useCallback, useRef } from 'react';
import { Animated, Easing } from 'react-native';
const timing = Animated.timing;

interface Props {
    count: number;
    initValue: number;
    duration: number;
    delay: number;
    callback: () => any;
}

export const useStaggerAnimation = (props: Props) => {
    const { count = 2, initValue = 1, duration = 300, delay = 200, reversed, callback = () => null } = props;
    let { easing = Easing.bezier(0.42, 0, 1, 1) } = props;
    const animations = useRef(
        Array(count)
            .fill(initValue)
            .map(() => new Animated.Value(initValue)),
    );

    const startAnimation = useCallback(
        (startValue: number = 0, toValue: number = 1) => {
            animations.current.forEach(animation => animation.setValue(startValue));
            if (reversed) {
                easing = Easing.out(easing);
            }
            Animated.stagger(
                delay,
                animations.current.map(animation => {
                    return timing(animation, {
                        toValue,
                        easing,
                        duration,
                    });
                }),
            ).start(() => startAnimation());
        },
        [easing, reversed, duration],
    );

    return [animations.current, startAnimation];
};
