/*
 * @flow
 * created by wyk made in 2019-01-14 11:43:28
 */
import Config from '../Config';

export default function(data: { fileId: number, videoUrl: string }, onSuccessed?: Function, onError?: Function) {
	console.log('be_save_video', data);
	console.log('Config', 'https://datizhuanqian.com' + '/api/video?from=qcvod&api_token=' + TOKEN);
	fetch('https://datizhuanqian.com' + '/api/video?from=qcvod&api_token=' + TOKEN, {
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
			Toast.show({ content: '视频上传成功' });
			onSuccessed && onSuccessed(video);
		})
		.catch(err => {
			onError && onError(err);
			console.log('saveVideo fail');
		});
}
