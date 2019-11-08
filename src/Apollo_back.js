/*
 * @Author: Gaoxuan
 * @Date:   2019-07-31 10:35:57
 */

import React, { Component } from 'react';
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

@observer
class Apollo extends Component {
    async componentDidMount() {
        // 挂载socklit

        if (Platform.OS === 'android') {
            JPushModule.notifyJSDidLoad(resultCode => {
                if (resultCode === 0) {
                }
            });
        }
        // 注册Jpush
        JPushModule.getRegistrationID(registrationId => {});

        // 添加设备来源tag;
        JPushModule.addTags([Config.AppStore], success => {});

        // throw new Error('This is a test javascript crash!');

        // await Crashes.setEnabled(true);

        // const enabled = await Crashes.isEnabled();
        // console.log('enabled', enabled);

        // useCaptureVideo({ client, onSuccess, onFailed });
    }

    mountWebSockit(user) {
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
            echo.channel('notice').listen('NewNotice', this.sendLocalNotification);

            // 监听用户私人频道
            echo.private('App.User.' + user.id)
                .listen('WithdrawalDone', this.sendLocalNotification)
                .listen('NewLike', this.sendLocalNotification)
                .listen('NewFollow', this.sendLocalNotification)
                .listen('NewComment', this.sendLocalNotification)
                .listen('NewAudit', this.sendLocalNotification);
            // 系统通知栏
        }
    }

    // 本地推送通知
    sendLocalNotification(data) {
        const currentDate = new Date();
        JPushModule.sendLocalNotification({
            buildId: 1,
            id: data.id,
            content: data.content,
            extra: {},
            fireTime: currentDate.getTime() + 3000,
            title: data.title,
        });
    }

    onFailed = () => {
        Toast.show('上传失败');
    };

    onSuccess = () => {
        Toast.show('上传成功');
    };

    render() {
        const { checkServer } = this.props;
        this.mountWebSockit(app.me);
        const client = makeClient(app.me, checkServer); // 构建apollo client;
        app.client = client;
        // useCaptureVideo({ client, onSuccess: this.onSuccess, onFailed: this.onFailed });
        return (
            <ApolloProvider client={client}>
                <ApolloHooksProvider client={client}>
                    <AppRouter ref={Tools.setRootNavigation} />
                </ApolloHooksProvider>
            </ApolloProvider>
        );
    }
}

export default Apollo;
