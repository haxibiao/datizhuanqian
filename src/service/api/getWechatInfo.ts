import { Loading } from '@src/components';
// 获取用户微信授权信息
export default function getWechatInfo(code: string, onSuccess?: Promise, onFaild?: Promise) {
    Loading.show();
    let data = new FormData();
    data.append('code', code);

    fetch(Config.ServerRoot + '/api/v1/wechat/app/auth', {
        method: 'POST',
        body: data,
    })
        .then(response => response.json())
        .then(result => {
            Loading.hide();
            onSuccess && onSuccess(result);
        })
        .catch(error => {
            Toast.show({
                content: error.toString().replace(/Error: GraphQL error: /, ''),
            });
            Loading.hide();
            onFaild && onFaild(error);
        });
}
