import { useCallback, useEffect, useRef } from 'react';
import { AppState, Clipboard } from 'react-native';
import { GQL } from '@src/apollo';
import { app } from 'store';
import { TipsOverlay, RewardOverlay, ErrorOverlay } from 'components';
import RewardVideoTipsOverlay from '@src/components/Overlay/RewardVideoTipsOverlay';

interface Props {
    client: any;
}

//采集视频
export const useCaptureVideo = (props: Props) => {
    const { client } = props;
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
                ErrorOverlay.show({
                    title: '视频链接采集失败',
                    content: '今天采集量已达上限，看激励视频才可继续采集',
                    playVideoVariables: {
                        callback: () => spiderVideo(path),
                        noReward: true,
                    },
                    buttonName: '看视频采集',
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
        const [error, result] = await Helper.exceptionCapture(() => captureVideo(path));
        // console.log('error:', error, 'result:', result);
        if (error) {
            Toast.show({ content: error.message });
            Clipboard.setString('');
        } else if (result) {
            ErrorOverlay.show({
                title: '视频链接采集成功',
                content:
                    '视频上传成功后，即可获得智慧点奖励，偷偷告诉你个秘密：使用此方式采集抖音视频更容易被其他人刷到哦~',
                action: () => {
                    Helper.middlewareNavigate('MyPublish');
                },
                buttonName: '我的视频',
            });

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
                ErrorOverlay.hide();
            }
        },
        [captureVideo],
    );

    useEffect(() => {
        AppState.addEventListener('change', stateChangeHandle);
        return () => {
            AppState.removeEventListener('change', stateChangeHandle);
        };
    }, [stateChangeHandle]);
};
