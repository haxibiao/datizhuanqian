import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

interface Props {
    initValue: number;
    duration: number;
    callback: () => any;
}

export const useLinearAnimation = (props: Props) => {
    const { initValue = 1, duration = 300, callback = () => null } = props;
    const animation = useRef(new Animated.Value(initValue));

    const startAnimation = useCallback(
        (startValue: number = 0, toValue: number = 1) => {
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
