import { WeChat } from 'native';
import { app } from 'store';
import { GQL } from 'apollo';
import JAnalytics from 'janalytics-react-native';
interface Props {
    onSuccess?: Function;
    onFailed?: Function;
}

export function bindWechat(props: Props) {
    const { onFailed } = props;
    JAnalytics.postEvent({
        type: 'count',
        id: '10002',
        extra: {
            绑定事件: '点击微信绑定',
        },
    });
    WeChat.isSupported()
        .then((isSupported: any) => {
            if (isSupported) {
                WeChat.wechatLogin()
                    .then((code: any) => {
                        bindWx(code, props);
                    })
                    .catch(() => {
                        Toast.show({ content: '微信身份信息获取失败，请检查微信是否登录' });
                        onFailed && onFailed('微信身份信息获取失败，请检查微信是否登录');
                    });
            } else {
                Toast.show({ content: '未安装微信或当前微信版本较低' });
                onFailed && onFailed('未安装微信或当前微信版本较低');
            }
        })
        .catch(() => {
            Toast.show({ content: '未知错误，绑定失败' });
            onFailed && onFailed('未知错误，绑定失败');
        });
}

function bindWx(code: any, props: Props) {
    const { onSuccess, onFailed } = props;
    app.client
        .mutate({
            mutation: GQL.BindWechatMutation,
            variables: {
                code,
                version: 'v2',
            },
            refetchQueries: () => [
                {
                    query: GQL.UserMeansQuery,
                    variables: { id: app.me.id },
                    fetchPolicy: 'network-only',
                },
            ],
        })
        .then((result: any) => {
            onSuccess && onSuccess(result);
        })
        .catch((error: any) => {
            console.log('error', error);
            onFailed && onFailed(error);
            Toast.show({ content: error.toString().replace(/Error: GraphQL error: /, '') });
        });
}
