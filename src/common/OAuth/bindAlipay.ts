import { Alipay, AppUtil } from 'native';
import { bindAlipayFailedTrack, bindAlipaySucceedTrack, bindAlipayTrack } from '../track';
import { Loading } from 'components';
import { GQL } from 'apollo';
import { app } from 'store';

export const getAlipayAuthCode = (props: { callback: Function }) => {
    const { callback } = props;
    bindAlipayTrack();
    Alipay.AlipayAuth()
        .then((code: any) => {
            console.log('code', code);
            callback && callback(code);
        })
        .catch(error => {
            Toast.show({
                content: '请登录或尝试更新支付宝再授权',
            });
            bindAlipayFailedTrack(error);
        });
};

export const bindAlipay = (props: { authCode: any; onFaild: Function }) => {
    const { authCode, onFaild } = props;
    app.mutationClient
        .mutate({
            mutation: GQL.OAuthBindMutation,
            variables: {
                code: authCode,
                oauth_type: 'ALIPAY',
            },
            refetchQueries: () => [
                {
                    query: GQL.UserMeansQuery,
                    variables: { id: app.me.id },
                },
                {
                    query: GQL.UserQuery,
                    variables: { id: app.me.id },
                },
            ],
        })
        .then((data: any) => {
            Loading.hide();
            Toast.show({
                content: '绑定成功',
            });
            bindAlipaySucceedTrack();
            Helper.middlewareNavigate('Main', null, Helper.middlewareNavigate({ routeName: '提现' }));
        })
        .catch((error: { toString?: any; error?: any }) => {
            Loading.hide();
            onFaild && onFaild();
            Toast.show({
                content: error.toString().replace(/Error: GraphQL error: /, ''),
            });
            bindAlipayFailedTrack(error.toString());
        });
};
