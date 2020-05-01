import * as WeChat from 'react-native-wechat';
import { app } from 'store';
import { GQL } from 'apollo';
import JAnalytics from 'janalytics-react-native';
import { bindWeChatTrack, bindWeChatSucceedTrack, bindWeChatFailedTrack } from '../track';
import { getWechatAuthCode } from './wechatAuth';

interface Props {
    onSuccess?: Function;
    onFailed?: Function;
}

export const getAuthCode = (props: Props) => {
    const { onFailed } = props;
    bindWeChatTrack();
    getWechatAuthCode({
        callback: (code: any) => {
            bindWechat(code, props);
        },
        onFailed,
    });
};

function bindWechat(code: any, props: Props) {
    const { onSuccess, onFailed } = props;

    app.mutationClient
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
            bindWeChatSucceedTrack();
        })
        .catch((error: any) => {
            const content = error.toString().replace(/Error: GraphQL error: /, '');
            onFailed && onFailed(content);
            Toast.show({ content: content });
            bindWeChatFailedTrack({ error: content });
        });
}
