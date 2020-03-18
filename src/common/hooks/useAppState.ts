import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { app } from 'store';

interface Props {
    (Event?: any): any;
}

//App状态
export const useAppState = (callback: Props) => {
    const stateChangeHandle = useCallback(async event => {
        if (event === 'active') {
            // console.log('====================================');
            // console.log('callback', callback);
            // console.log('====================================');
            callback();
        }
    }, []);

    useEffect(() => {
        AppState.addEventListener('change', stateChangeHandle);
        return () => {
            AppState.removeEventListener('change', stateChangeHandle);
        };
    }, [stateChangeHandle]);
};
