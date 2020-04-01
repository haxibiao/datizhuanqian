// 获取用户微信授权信息
export default function getWechatInfo(code: string, onSuccess?: Promise, onFaild?: Promise) {
    let data = new FormData();
    data.append('code', code);

    fetch(Config.ApiServceRoot + '/api/v1/wechat/app/auth', {
        method: 'POST',
        body: data,
    })
        .then(response => response.json())
        .then(result => {
            onSuccess && onSuccess(result);
        })
        .catch(() => {
            onFaild && onFaild();
        });
}
