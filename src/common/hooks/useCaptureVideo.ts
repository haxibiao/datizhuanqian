import { useCallback, useEffect, useRef } from 'react';
import { AppState, Clipboard, Alert } from 'react-native';
import { GQL } from '@src/apollo';
import { exceptionCapture } from '@src/common';
import { app } from 'store';
import { RewardVideoTipsOverlay, LoadingOverlay } from 'components';
import { Tools } from 'utils';

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

    const checkUser = async (path: string) => {
        LoadingOverlay.show({ content: '正在采集粘贴板视频' });

        const result = await client.query({
            query: GQL.checkUser,
            variables: {
                id: app.me.id,
            },
        });

        switch (Tools.syncGetter('data.user.share_spider_status', result)) {
            case 0:
                spiderVideo(path);
                break;
            case 1:
                RewardVideoTipsOverlay.show({
                    callback: () => spiderVideo(path),
                });
            case -1:
                Toast.show({
                    content: '今日视频采集数量已达上限',
                });
            default:
                spiderVideo(path);
                break;
        }
    };

    const spiderVideo = async (path: any) => {
        const [error, result] = await exceptionCapture(() => captureVideo(path));
        console.log('error:', error, 'result:', result);
        if (error && onFailed) {
            onFailed(error);
            Clipboard.setString('');
            LoadingOverlay.hide();
        } else if (result && onSuccess) {
            onSuccess(result);
            //清空粘贴板
            Clipboard.setString('');
            LoadingOverlay.hide();
        }
    };

    const stateChangeHandle = useCallback(
        async event => {
            if (event === 'active') {
                const path = await Clipboard.getString();
                if (
                    TOKEN &&
                    clipboardString.current !== path &&
                    String(path).indexOf('http') !== -1 &&
                    (String(path).indexOf('douyin') !== -1 || String(path).indexOf('chenzhongtech') !== -1)
                ) {
                    clipboardString.current = path;
                    console.log('clipboardString', path);
                    checkUser(path);
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
