/*
 * @flow
 * created by wyk made in 2019-01-14 11:44:03
 */

import { VideoUploader, VodUploader } from 'native';
import { app } from 'store';

export const { cancelUpload } = VideoUploader;

export type UploadOption = {
    videoPath: string;
    onBeforeUpload?: Function;
    onStarted?: Function;
    onProcess?: Function;
    onCancelled?: Function;
    onCompleted?: Function;
    onError?: Function;
};

export function vodUpload(props: UploadOption) {
    const { videoPath, onBeforeUpload, onStarted, onProcess, onCancelled, onCompleted, onError } = props;

    fetch('https://haxibiao.com/api/signature/vod-' + Config.Name, { method: 'GET' })
        .then(response => response.text())
        .then(signature => {
            console.log('signature', signature, videoPath);
            onStarted && onStarted('111111');
            VodUploader.startUpload(signature, videoPath).then((publishCode: any) => {
                console.log('publish code 的值为 : ', publishCode);
                if (publishCode != 0) {
                    // vod上传失败
                    Toast.show({ content: '视频上传失败，请稍后重试' });
                }
            });
            VodUploader.addListener('videoProgress', (data: any) => {
                const progerss = (data.upload_bytes / data.total_bytes) * 100;
                console.log('上传结束原生端信息 : ', data);
                onProcess && onProcess(progerss || 0);
            });
            VodUploader.addListener('resultVideo', (data: any) => {
                console.log('resultVideo', data);
                onCompleted && saveVideo(data, onCompleted); //将腾讯云的视频地址保存到服务器
            });
        })
        .catch(error => {
            console.log('提示', error);
        });
}

function saveVideo(data: { video_id: any; video_url: any }, onCompleted: Function) {
    console.log('be_save_video', data);
    console.log('Config', Config.ServerRoot + '/api/video?from=qcvod&api_token=' + app.me.token);
    fetch(Config.ServerRoot + '/api/video?from=qcvod&api_token=' + app.me.token, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fileId: data.video_id,
            videoUrl: data.video_url,
        }),
    })
        .then(response => response.json())
        .then(video => {
            console.log('savedVideo', video);

            onCompleted && onCompleted(video);
        })
        .catch(err => {
            console.log('saveVideo fail', err);
        });
}
