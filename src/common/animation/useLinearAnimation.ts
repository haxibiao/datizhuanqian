import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

interface Props {
    duration: number;
}

export const useLinearAnimation = (props: Props) => {
    const animation = useRef(new Animated.Value(props.duration));

    const startAnimation = useCallback(() => {
        animation.current.setValue(0);
        Animated.timing(animation.current, {
            toValue: 1,
            duration: props.duration,
        }).start();
    }, [props.duration]);

    return [animation.current, startAnimation];
};
