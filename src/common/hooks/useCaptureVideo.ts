import { useCallback, useEffect, useRef } from 'react';
import { AppState, Clipboard } from 'react-native';
import { GQL } from '@src/apollo';
import { exceptionCapture } from '../helper';
import { app } from 'store';
import { TipsOverlay } from 'components';
import RewardVideoTipsOverlay from '@src/components/Overlay/RewardVideoTipsOverlay';

interface Props {
    client: any;
    onSuccess?: (Event?: any) => any;
    onFailed?: (Event?: any) => any;
}

//采集视频
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
        const result = await client.query({
            query: GQL.checkUser,
            variables: {
                id: app.me.id,
            },
        });

        switch (Helper.syncGetter('data.user.share_spider_status', result)) {
            case 0:
                spiderVideo(path);
                break;
            case 1:
                RewardVideoTipsOverlay.show({
                    callback: () => spiderVideo(path),
                });
                break;
            case -1:
                Toast.show({
                    content: '今日视频采集数量已达上限',
                });
                Clipboard.setString('');
                break;
            default:
                spiderVideo(path);
                break;
        }
    };

    const spiderVideo = async (path: any) => {
        const [error, result] = await exceptionCapture(() => captureVideo(path));
        // console.log('error:', error, 'result:', result);
        if (error && onFailed) {
            onFailed(error);
            Clipboard.setString('');
        } else if (result && onSuccess) {
            onSuccess(result);
            console.log('result', result);
            //清空粘贴板
            Clipboard.setString('');
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
            } else {
                TipsOverlay.hide();
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
