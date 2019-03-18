/*
* @flow
* created by wyk made in 2019-01-13 20:57:40
*/
import Config from '../Config';

export default async function(images: Array, callback?: Function, onError?: Function) {
	var data = new FormData();
	if (images && images instanceof Array) {
		images.map((elem, index) => {
			data.append('photo[]', {
				uri: elem,
				name: 'image.jpg',
				type: 'image/jpg'
			});
		});
		const config = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data'
			},
			body: data
		};
		let uri = Config.ServerRoot + '/api/image/save?api_token=' + TOKEN;
		await fetch(uri, config)
			.then(response => response.json())
			.then(result => {
				Toast.show({ content: '图片上传成功', type: 'success' });
				callback && callback(result);
			})
			.catch(err => {
				console.log('err', err);
				Toast.show({ content: '图片上传失败', type: 'fail' });
				onError && onError(err);
			});
	}
}
