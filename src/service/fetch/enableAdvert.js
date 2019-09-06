import { Config } from 'utils';

//获取广告开启配置
export default function(callback: Promise) {
	console.log('Config', Config.ServerRoot);
	Promise.race([
		fetch(Config.ServerRoot + '/app-config/ad.json?' + Date.now()),
		new Promise((resolve, reject) => {
			setTimeout(() => reject(new Error('request timeout')), 500);
		})
	])
		.then(response => response.json())
		.then(result => {
			console.log('result', result);
			callback(result);
		})
		.catch(err => {
			callback({
				enable_splash: false,
				enable_question: true,
				enable_reward: true
			});
		});
}
