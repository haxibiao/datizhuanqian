/*
 * @flow
 * created by wyk made in 2019-01-14 11:44:03
 */
import VodUploader from '../../../native/VodUploader';
import saveVideo from './saveVideo';

export const cancelUpload = VodUploader.cancelUpload;

export type UploadOption = {
	videoPath: string,
	onBeforeUpload?: Function,
	onStarted?: Function,
	onProcess?: Function,
	onCancelled?: Function,
	onCompleted?: Function,
	onError?: Function
};

export default function(props: UploadOption) {
	let { videoPath, onBeforeUpload, onStarted, onProcess, onCancelled, onCompleted, onError } = props;
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
					onCompleted && onCompleted(data); //将腾讯云的视频地址保存到服务器
				});
				VodUploader.addListener('cancelled', uploadId, data => {
					onCancelled && onCancelled();
				});
				VodUploader.addListener('error', uploadId, data => {
					onError ? onError(data) : Toast.show({ content: '视频上传失败' });
				});
			})
			.catch(err => {
				onError ? onError(data) : Toast.show({ content: '视频上传失败' });
			});
	});
}
