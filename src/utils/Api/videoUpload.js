/*
* @flow
* created by wyk made in 2019-01-14 11:44:03
*/
import VodUploader from '../../../native/VodUploader';
import saveVideo from './saveVideo';

export type UploadOption = {
	videoPath: string,
	onBeforeUpload?: Function,
	onStarted?: Function,
	onProcess?: Function,
	onCompleted?: Function,
	onError?: Function
};

export default function(props: UploadOption) {
	let { videoPath, onBeforeUpload, onStarted, onProcess, onCompleted, onError } = props;
	VodUploader.getFileInfo(videoPath).then(metadata => {
		const options = Object.assign(
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'content-type': metadata.mimeType
				}
			},
			{ path: videoPath }
		);
		onBeforeUpload && onBeforeUpload(metadata);
		VodUploader.startUpload(options) //上传
			.then(uploadId => {
				onStarted && onStarted(uploadId);
				VodUploader.addListener('progress', uploadId, data => {
					onProcess && onProcess(parseInt(data.progress)); //上传进度
				});
				VodUploader.addListener('completed', uploadId, data => {
					onCompleted && saveVideo(data, onCompleted); //将腾讯云的视频地址保存到服务器
				});
				VodUploader.addListener('error', uploadId, data => {
					onError ? onError(data) : Toast.show({ content: '视频上传失败', type: 'fail' });
				});
			})
			.catch(err => {
				onError ? onError(data) : Toast.show({ content: '视频上传失败', type: 'fail' });
			});
	});
}
