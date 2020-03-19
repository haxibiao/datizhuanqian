import React, { Fragment, Component, useEffect, useState } from 'react';
import { StyleSheet, YellowBox, View, Image, Text } from 'react-native';
import { Toast, ErrorBoundary } from '@src/components';
import ApolloApp from '@src/apollo/ApolloApp';

import { ad, WeChat } from '@app/native';
import { app, config } from '@src/store';
import { checkUpdate, readPhoneState } from '@src/common';
import service from 'service';
import Orientation from 'react-native-orientation';
import codePush from 'react-native-code-push';

import Matomo from 'react-native-matomo';

const App = () => {
    const [responseText, setResponseText] = useState('');
    const [serverMaintenance, setServerMaintenance] = useState();
    let toast: Toast | null = null;

    useEffect(() => {
        //启动就检查下刷子账号,禁用一切操作
        checkServer();

        // 初始化 AdManager, 之后才能启动开屏
        ad.AdManager.init();
        // 信息流广告先预加载，提速第一次签到时显示的速度
        ad.AdManager.loadFeedAd();
        // 获取广告开放状态
        service.enableAdvert((data: { disable: { [x: string]: any } }) => {
            // 只针对华为检测是否开启开屏广告 （做请求后再加载开屏广告首屏会先露出）
            if (Config.AppStore === 'huawei' && !data.disable[Config.AppStore]) {
                ad.Splash.loadSplashAd();
            }
            config.saveAdvertConfig(data);
        });
        if (Config.AppStore !== 'huawei') {
            ad.Splash.loadSplashAd();
        }
        // 恢复用户身份信息
        app.recallUser();
        // 恢复缓存
        app.recallCache();
        // 检查更新
        checkUpdate('autoCheck');
        // 微信注册
        WeChat.registerApp('wx6fee77d331d42a27');
        // 注册全局变量Toast
        global.Toast = toast;
        // 禁止横屏
        Orientation.lockToPortrait();
        //获取手机号
        readPhoneState();
        //加载激励视频缓存
        ad.RewardVideo.loadAd().then(() => {});

        Matomo.initTracker('http://matomo.haxibiao.com/index.php', 1);
        // Matomo.trackScreen('Home', '首页');
        // Matomo.trackScreen('Profile', '我的');
        // Matomo.setAppOptOut(true);
        console.log('Matomo :', Matomo);
        // Matomo.setUserId('123e4567-e89b-12d3-a456-426655440000');
    }, []);

    const checkServer = () => {
        let { token } = app.me;

        //根据不同的用户返回503，可以用来封掉刷子账号在机器上的无效操作
        fetch(Config.ServerRoot + '/api/user?api_token=' + token)
            .then(response => {
                if (response.status === 503) {
                    setServerMaintenance(response);
                }
                return response.text();
            })
            .then(responseText => {
                setResponseText(responseText);
            })
            .catch(error => {
                console.warn('server error', error);
            });
    };

    const showMaintenance = () => {
        if (serverMaintenance) {
            return (
                <View style={styles.maintenance}>
                    <Image style={styles.image} source={require('./assets/images/server_maintenance.jpg')} />
                    <View style={styles.textWrap}>
                        <Text style={styles.text}>{responseText || '服务器维护中,先休息一会儿吧!'}</Text>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    };

    return (
        <Fragment>
            <View style={styles.container} onLayout={config.listenLayoutChange}>
                <ErrorBoundary>
                    <ApolloApp checkServer={checkServer} />
                </ErrorBoundary>
                {showMaintenance()}
                <Toast ref={(ref: any) => (toast = ref)} />
            </View>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
    },
    image: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        width: null,
        height: null,
    },
    maintenance: {
        alignItems: 'center',
        backgroundColor: '#fff',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    text: {
        color: Theme.subTextColor,
        fontSize: PxFit(15),
        lineHeight: PxFit(18),
    },
    textWrap: {
        alignItems: 'center',
        left: 0,
        paddingHorizontal: PxFit(20),
        position: 'absolute',
        right: 0,
        top: '65%',
    },
});

const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export default codePush(codePushOptions)(App);
