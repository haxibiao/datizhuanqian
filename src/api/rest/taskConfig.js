//任务信息配置
export default function getTaskConfig(token?: String, callback?: Promise) {
	fetch(Config.ServerRoot + '/api/app/task/user-config?api_token=' + token)
		.then(response => response.json())
		.then(result => {
			callback(result);
		})
		.catch(err => {
			console.log(err);
		});
}
