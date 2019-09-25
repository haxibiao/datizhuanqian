import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

interface Props {
    value: number;
    toValue: number;
}

export const useBounceAnimation = (props: Props) => {
    const animation = useRef(new Animated.Value(props.value));

    const startAnimation = useCallback(() => {
        animation.current.setValue(props.value);
        Animated.spring(animation.current, {
            toValue: props.toValue,
            friction: 2,
            tension: 40,
        }).start();
    }, []);

    return [animation.current, startAnimation];
};
