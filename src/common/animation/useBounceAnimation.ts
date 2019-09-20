import { useCallback, useState } from 'react';
import { Animated } from 'react-native';

interface Props {
    value: number;
    toValue: number;
}

export const useBounceAnimation = (props: Props) => {
    const [animation] = useState(new Animated.Value(props.value));

    const startAnimation = useCallback(() => {
        animation.setValue(props.value);
        Animated.spring(animation, {
            toValue: props.toValue,
            friction: 2,
            tension: 40,
        }).start();
    }, []);

    return [animation, startAnimation];
};
