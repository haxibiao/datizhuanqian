/*
 * @flow
 * created by wyk made in 2019-01-14 11:44:03
 */
import { VideoUploader } from 'native';
import { Config } from 'utils';

export const { cancelUpload } = VideoUploader;

export type UploadOption = {
    videoPath: string,
    onBeforeUpload?: Function,
    onStarted?: Function,
    onProcess?: Function,
    onCancelled?: Function,
    onCompleted?: Function,
    onError?: Function,
};

export function videoUpload(props: UploadOption) {
    const { videoPath, onBeforeUpload, onStarted, onProcess, onCancelled, onCompleted, onError } = props;

    VideoUploader.getFileInfo(videoPath).then(metadata => {
        const options = Object.assign(
            {
                method: 'POST',
                type: 'multipart',
                field: 'video',
                headers: {
                    'content-type': 'multipart/form-data',
                    token: TOKEN,
                },
                parameters: {
                    videoName: metadata.name,
                    api_token: TOKEN,
                },
            },
            {
                url: Config.UploadServer + '/api/video/upload',
                path: videoPath,
            },
        );
        onBeforeUpload && onBeforeUpload(metadata);
        VideoUploader.startUpload(options) // 上传
            .then(uploadId => {
                onStarted && onStarted(uploadId);
                VideoUploader.addListener('progress', uploadId, data => {
                    onProcess && onProcess(parseInt(data.progress, 10)); // 上传进度
                });
                VideoUploader.addListener('completed', uploadId, data => {
                    onCompleted && onCompleted(data);
                });
                VideoUploader.addListener('cancelled', uploadId, data => {
                    onCancelled && onCancelled();
                });
                VideoUploader.addListener('error', uploadId, data => {
                    onError ? onError(data) : Toast.show({ content: '视频上传失败' });
                });
            })
            .catch(err => {
                console.warn('err', err);
                onError ? onError(err) : Toast.show({ content: '视频上传失败' });
            });
    });
}
