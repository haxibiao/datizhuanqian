import { app } from 'store';

interface Props {
    callback: Function;
}

//任务信息配置
export default function getTaskConfig(props: Props) {
    const { callback } = props;
    fetch(Config.ServerRoot + '/api/app/task/user-config?api_token=' + app.me.token)
        .then(response => response.json())
        .then(result => {
            callback && callback(result);
        })
        .catch(err => {
            console.log('err getTaskConfig', err);
        });
}
