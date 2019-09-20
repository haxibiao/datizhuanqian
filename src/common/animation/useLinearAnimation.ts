import { useCallback, useState } from 'react';
import { Animated } from 'react-native';

interface Props {
    duration: number;
}

export const useLinearAnimation = (props: Props) => {
    const [animation] = useState(new Animated.Value(props.duration));

    const startAnimation = useCallback(() => {
        animation.setValue(0);
        Animated.timing(animation, {
            toValue: 1,
            duration: props.duration,
        }).start();
    }, [props.duration]);

    return [animation, startAnimation];
};
