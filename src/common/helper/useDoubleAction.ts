import { useCallback, useRef } from 'react';

export const useDoubleAction = (doubleCallback: (e?: any) => any, interval: number, callback: (e?: any) => any) => {
    const now = useRef(new Date());
    const lastExec = useRef(new Date(0));
    const timer = useRef();

    const enhanceFunction = useCallback(() => {
        if (timer.current) {
            clearInterval(timer.current);
        }
        now.current = new Date();
        const diff = interval - (now.current - lastExec.current);
        lastExec.current = now.current;
        if (diff > 0) {
            doubleCallback();
        } else {
            if (callback) {
                timer.current = setTimeout(() => {
                    callback();
                }, interval * 2);
            }
        }
    }, []);

    return enhanceFunction;
};
