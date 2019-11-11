import { useCallback, useRef, useEffect } from 'react';
import { Keyboard } from 'react-native';

type Listener = (e: any) => any;

export const useKeyboardListener = (onKeyboardShow: Listener, onKeyboardHide: Listener) => {
    const showListener = useRef({});
    const hideListener = useRef({});

    useEffect(() => {
        const showListenerName = Device.IOS ? 'keyboardWillShow' : 'keyboardDidShow';
        showListener.current = Keyboard.addListener(showListenerName, e => onKeyboardShow(e));
        const hideListenerName = Device.IOS ? 'keyboardWillHide' : 'keyboardDidHide';
        hideListener.current = Keyboard.addListener(hideListenerName, e => onKeyboardHide(e));
        return () => {
            showListener.current.remove();
            hideListener.current.remove();
        };
    }, []);
};
