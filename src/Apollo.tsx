import React, { Component, useContext, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

import { makeClient, ApolloProvider } from 'apollo';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';

import { observer, app } from 'store';
import { Config, Tools } from 'utils';

import JPushModule from 'jpush-react-native';
import Echo from 'laravel-echo';
import Socketio from 'socket.io-client';

import AppRouter from './routers';

import { useCaptureVideo } from '@src/common';

export default observer(props => {
    const { checkServer } = props;

    // const store = useContext(StoreContext);
    const client = makeClient(app.me, checkServer); // 构建apollo client;
    app.client = client;

    const onFailed = useCallback(error => {
        console.log('onFailed', error);
        Toast.show({ content: error.message });
    }, []);

    const onSuccess = useCallback(() => {
        Toast.show({ content: '粘贴板视频采集成功,通过审核即可获得智慧点奖励' });
    }, []);

    useCaptureVideo({ client, onSuccess, onFailed });

    const mountWebSocket = (user: { token: string | undefined; id: string }) => {
        if (user.token != undefined) {
            // 构造laravel echo及Socket Client
            const echo = new Echo({
                broadcaster: 'socket.io',
                host: 'ws://socket.datizhuanqian.com:6001',
                client: Socketio,
                auth: {
                    headers: {
                        Authorization: 'Bearer ' + user.token,
                    },
                },
            });

            app.setEcho(echo);

            // 监听公共频道
            echo.channel('notice').listen('NewNotice', sendLocalNotification);

            // 监听用户私人频道
            echo.private('App.User.' + user.id)
                .listen('WithdrawalDone', sendLocalNotification)
                .listen('NewLike', sendLocalNotification)
                .listen('NewFollow', sendLocalNotification)
                .listen('NewComment', sendLocalNotification)
                .listen('NewAudit', sendLocalNotification);
            // 系统通知栏
        }
    };

    // 本地推送通知
    const sendLocalNotification = (data: { id: any; content: any; title: any }) => {
        const currentDate = new Date();
        JPushModule.sendLocalNotification({
            buildId: 1,
            id: data.id,
            content: data.content,
            extra: {},
            fireTime: currentDate.getTime() + 3000,
            title: data.title,
        });
    };

    // let user = Helper.syncGetter('userStore.me', store);

    useEffect(() => {
        mountWebSocket(app.me);
    }, [app.me]);

    return (
        <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
                <AppRouter ref={Tools.setRootNavigation} />
            </ApolloHooksProvider>
        </ApolloProvider>
    );
});