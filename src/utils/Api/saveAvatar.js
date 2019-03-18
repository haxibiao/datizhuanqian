/*
* @flow
* created by wyk made in 2019-01-14 13:42:13
*/
import store from '../../store';
import actions from '../../store/actions';
import Config from '../Config';

export default function(imagePath: string) {
	var data = new FormData();
	data.append('avatar', {
		uri: imagePath,
		name: 'avatar.jpg',
		type: 'image/jpg'
	});

	const config = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data'
		},
		body: data
	};
	console.log('Config,', Config.ServerRoot + '/api/user/save-avatar?api_token=' + TOKEN, config);
	fetch(Config.ServerRoot + '/api/user/save-avatar?api_token=' + TOKEN, config)
		.then(response => response.text())
		.then(avatar => {
			console.log('avatar', avatar);
			store.dispatch(actions.updateProfile({ avatar }, Date.now()));
			Toast.show({ content: '头像修改成功', type: 'success' });
		})
		.catch(err => {
			Toast.show({ content: '上传失败，可能是图片过大或者格式不兼容', type: 'fail' });
		});
}
