import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

interface Props {
    initValue: number;
    duration: number;
}

export const useLinearAnimation = (props: Props) => {
    const { initValue = 1, duration = 300 } = props;
    const animation = useRef(new Animated.Value(initValue));

    const startAnimation = useCallback(
        (startValue: number = 0, toValue: number = 1, callback: Function = () => null) => {
            animation.current.setValue(startValue);
            Animated.timing(animation.current, {
                toValue,
                duration,
            }).start(() => callback());
        },
        [props.duration],
    );

    return [animation.current, startAnimation];
};
