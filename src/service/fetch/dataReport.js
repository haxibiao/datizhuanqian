import { Config } from 'utils';

// 数据上报
export default function(data?: JSON, callback?: Promise) {
    let body = new FormData();
    body.append('data', data);

    fetch(Config.ServerRoot + '/api/app/report/matomo', {
        method: 'POST',
        body: body,
    })
        .then(response => response.json())
        .then(result => {
            callback(result);
        })
        .catch(err => {
            callback(err);
        });
}
