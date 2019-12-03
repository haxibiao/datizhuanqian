import React, { useEffect, useState } from 'react';
import { WeChat } from 'native';
import { config, app } from 'store';
import { GQL, useMutation } from 'apollo';

interface Props {
    onSuccess?: Function;
    onFailed?: Function;
}

export function bindWechat(props: Props) {
    WeChat.isSupported()
        .then((isSupported: any) => {
            if (isSupported) {
                WeChat.wechatLogin()
                    .then((code: any) => {
                        bindWx(code, props);
                    })
                    .catch(err => {
                        Toast.show({ content: '微信身份信息获取失败，请检查微信是否登录' });
                    });
            } else {
                Toast.show({ content: '未安装微信或当前微信版本较低' });
            }
        })
        .catch(() => {
            Toast.show({ content: '绑定失败' });
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
        });
}
