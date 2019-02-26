/*
 * @flow
 * created by wyk made in 2019-02-26 22:34:41
 */
import VodUploader from '../../native/VodUploader';
import Config from '../constants/Config';
import Methods from './Methods';

function saveVideo(token, data, onSuccessed) {
	console.log('be_save_video', data);
	console.log('Config', Config.ServerRoot + '/api/video?from=qcvod&api_token=' + token);
	fetch(Config.ServerRoot + '/api/video?from=qcvod&api_token=' + token, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			fileId: data.fileId,
			videoUrl: data.videoUrl
		})
	})
		.then(response => response.json())
		.then(video => {
			console.log('savedVideo', video);
			Methods.toast('视频上传成功', 150);
			onSuccessed && onSuccessed(video);
		})
		.catch(err => {
			console.log('saveVideo fail');
		});
}

// {
// token
// 	videoPath,
// 	onBeforeUpload,
// 	onStarted,
// 	onProcess,
// 	onCompleted,
// 	onError
// }
export default function(params) {
	let { token, videoPath, onBeforeUpload, onStarted, onProcess, onCompleted, onError } = params;
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
					onCompleted && saveVideo(token, data, onCompleted); //将腾讯云的视频地址保存到服务器
				});
				VodUploader.addListener('error', uploadId, data => {
					onError ? onError(data) : Methods.toast('视频上传失败', 150);
				});
			})
			.catch(err => {
				onError ? onError(data) : Methods.toast('视频上传失败', 150);
			});
	});
}
