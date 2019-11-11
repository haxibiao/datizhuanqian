import { useRef, useEffect } from 'react';
import { BackHandler } from 'react-native';

interface Props {
    callback: (e?: any) => any;
}

export const useBackHandler = (props: Props) => {
    const backListener = useRef();

    useEffect(() => {
        backListener.current = BackHandler.addEventListener('hardwareBackPress', () => {
            props.callback();
            return true;
        });
        return () => {
            backListener.current.remove();
        };
    }, []);
};

useBackHandler.defaultProps = {
    callback: () => null,
};
