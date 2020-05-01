import React, { Component, useContext, useCallback, useEffect } from 'react';
import { Platform, View, Text } from 'react-native';

import { makeClient, ApolloProvider } from './index';
import { makeSnsClient } from './snsClient';
import { makeMutationClient } from './mutationClient';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';

import { observer, app, config } from 'store';

import { ad } from '@app/native';
import { TipsOverlay } from '@src/components';

import JPushModule from 'jpush-react-native';
import Echo from 'laravel-echo';
import Socketio from 'socket.io-client';

import AppRouter from '@src/routers';

import { useCaptureVideo, pageViewTrack } from '@src/common';

export default observer(props => {
    const { checkServer, navigation } = props;

    // const store = useContext(StoreContext);
    const client = makeClient(app.me, checkServer); // 构建apollo client;
    app.client = client;

    useEffect(() => {
        app.systemConfig();
    }, []);

    useCaptureVideo({ client });

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
        const snsClient = makeSnsClient(app.me, checkServer); // 构建sns apollo client;
        app.snsClient = snsClient;
        const mutationClient = makeMutationClient(app.me, checkServer);
        app.mutationClient = mutationClient;
    }, [app.me]);

    const getActiveRouteName = navigationState => {
        if (!navigationState) {
            return null;
        }
        const route = navigationState.routes[navigationState.index];
        if (route.routes) {
            return getActiveRouteName(route);
        }
        return route;
    };
    return (
        <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
                <AppRouter
                    uriPrefix={`dtzq://`}
                    ref={Helper.setRootNavigation}
                    onNavigationStateChange={(prevState, currentState, action) => {
                        const currentRouteName = getActiveRouteName(currentState);
                        const previousRouteName = getActiveRouteName(prevState);

                        if (previousRouteName.routeName !== currentRouteName.routeName) {
                            pageViewTrack({
                                route: currentRouteName,
                            });
                        }
                    }}
                />
            </ApolloHooksProvider>
        </ApolloProvider>
    );
});
