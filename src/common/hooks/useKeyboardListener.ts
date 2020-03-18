import { useRef, useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';

type Listener = (e: any) => any;
//键盘监听
export const useKeyboardListener = (onKeyboardShow: Listener, onKeyboardHide: Listener) => {
    const isIos = useRef(Platform.OS === 'ios').current;

    useEffect(() => {
        const showListenerName = isIos ? 'keyboardWillShow' : 'keyboardDidShow';
        const showListener = Keyboard.addListener(showListenerName, e => {
            if (onKeyboardShow instanceof Function) {
                onKeyboardShow(e);
            }
        });
        const hideListenerName = isIos ? 'keyboardWillHide' : 'keyboardDidHide';
        const hideListener = Keyboard.addListener(hideListenerName, e => {
            if (onKeyboardHide instanceof Function) {
                onKeyboardHide(e);
            }
        });
        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);
};
