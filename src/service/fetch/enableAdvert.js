import { Config } from 'utils';

//获取广告开启配置
export default function(callback: Promise) {
    Promise.race([
        fetch(Config.ServerRoot + '/api/app-ad-manage?' + Date.now()),
        new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('request timeout')), 800);
        }),
    ])
        .then(response => response.json())
        .then(result => {
            callback(result);
        })
        .catch(err => {
            callback({
                enable_splash: false,
                enable_question: true,
                enable_reward: true,
                enable_banner: true,
                enable_feed: true,
                disable: {
                    huawei: true,
                },
            });
        });
}
