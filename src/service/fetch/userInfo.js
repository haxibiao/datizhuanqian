//获取用户微信授权信息
export default function getWechatInfo(code?: String, callback: Promise) {
	var data = new FormData();
	data.append('code', code);

	fetch(Config.ServerRoot + '/api/v1/wechat/app/auth', {
		method: 'POST',
		body: data
	})
		.then(response => response.json())
		.then(result => {
			callback(result);
		});
}
