import { useCallback, useEffect, useRef } from 'react';
import { AppState, Clipboard,Alert } from 'react-native';
import { GQL } from '@src/apollo';
import { exceptionCapture } from '@src/common';
import { app } from 'store';
import { CaptureVideoOverlay } from 'components';

interface Props {
    client: any;
    onSuccess?: (Event?: any) => any;
    onFailed?: (Event?: any) => any;
}

export const useCaptureVideo = (props: Props) => {
    const { client, onSuccess, onFailed } = props;
    const clipboardString = useRef('');

    const captureVideo = useCallback(
        path => {
            return client.mutate({
                mutation: GQL.resolveDouyinVideo,
                variables: {
                    share_link: path,
                },
            });
        },
        [client],
    );

    const stateChangeHandle = useCallback(
        async event => {
            if (event === 'active') {
                console.log('====================================');
                console.log('active');
                console.log('====================================');
                const path = await Clipboard.getString();
                if (
                    TOKEN &&
                    clipboardString.current !== path &&
                    String(path).indexOf('http') !== -1 &&
                    (String(path).indexOf('douyin') !== -1 || String(path).indexOf('chenzhongtech') !== -1)
                ) {
                    clipboardString.current = path;
                    console.log('====================================');
                    console.log('clipboardString', path);
                    console.log('====================================');

                    // const UrlReg = /[a-zA-z]+://[^\z]*/;

                    // CaptureVideoOverlay.show({ path });
                    console.log('app.userCache.ticket', app.userCache.ticket);

                    const [error, result] = await exceptionCapture(() => captureVideo(path));
                    console.log('====================================');
                    console.log('error:', error, 'result:', result);
                    console.log('====================================');
                    if (error && onFailed) {
                        onFailed(error);
                        Clipboard.setString("");
                    } else if (result && onSuccess) {
                        onSuccess(result);
                        //清空粘贴板
                        Clipboard.setString("");
                    }
                }
            }
        },
        [captureVideo, onFailed, onSuccess],
    );

    useEffect(() => {
        AppState.addEventListener('change', stateChangeHandle);
        return () => {
            AppState.removeEventListener('change', stateChangeHandle);
        };
    }, [stateChangeHandle]);
};
