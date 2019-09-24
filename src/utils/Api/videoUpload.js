/*
 * @flow
 * created by wyk made in 2019-01-14 11:44:03
 */
import { VideoUploader } from 'native';
import Config from '../Config';

export const cancelUpload = VideoUploader.cancelUpload;

export type UploadOption = {
    videoPath: string,
    uploadType: string,
    onBeforeUpload?: Function,
    onStarted?: Function,
    onProcess?: Function,
    onCancelled?: Function,
    onCompleted?: Function,
    onError?: Function,
};

export default function(props: UploadOption) {
    let { videoPath, uploadType, onBeforeUpload, onStarted, onProcess, onCancelled, onCompleted, onError } = props;
    console.log('videoPath', videoPath);
    console.log('UploadServer', Config.UploadServer, uploadType);
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
                    type: uploadType,
                },
            },
            {
                url: Config.UploadServer + '/api/video/upload',
                path: videoPath,
            },
        );
        onBeforeUpload && onBeforeUpload(metadata);
        console.log('metadata', metadata);
        VideoUploader.startUpload(options) //上传
            .then(uploadId => {
                console.log('uploadId', uploadId);
                onStarted && onStarted(uploadId);
                VideoUploader.addListener('progress', uploadId, data => {
                    console.log('progerss', data);
                    onProcess && onProcess(parseInt(data.progress)); //上传进度
                });
                VideoUploader.addListener('completed', uploadId, data => {
                    console.log('completed', data);
                    onCompleted && onCompleted(data);
                });
                VideoUploader.addListener('cancelled', uploadId, data => {
                    onCancelled && onCancelled();
                });
                VideoUploader.addListener('error', uploadId, data => {
                    console.log('error', data);
                    onError ? onError(data) : Toast.show({ content: '视频上传失败' });
                });
            })
            .catch(err => {
                console.log('err', err);
                onError ? onError(data) : Toast.show({ content: '视频上传失败' });
            });
    });
}
