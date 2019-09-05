//获取用户微信授权信息
export default function getMiniProgramConfig(token?: String, callback: Promise) {
	fetch(Config.ServerRoot + '/api/app/config/wechat-mg-share-config?api_token=' + user.token)
		.then(response => response.json())
		.then(data => {
			callback(data);
		});
}
