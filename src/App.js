/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, Component } from 'react';
import { StyleSheet, YellowBox, View, Image, Text } from 'react-native';
import { Toast, ErrorBoundary } from 'components';
import { app, config } from 'store';

import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation';
import codePush from 'react-native-code-push';
import { ad, WeChat } from 'native';
import { ISIOS, Config, PxFit, Theme, iPhone11 } from 'utils';

import service from 'service';
import { checkUpdate, readPhoneState } from 'common';

import Apollo from './Apollo';

class App extends Component {
    toast: Toast;
    constructor(props) {
        super(props);
        global.TOKEN = null;
        this.state = {
            serverMaintenance: false,
            responseText: null,
        };

        YellowBox.ignoreWarnings([
            'Accessing view manager configs',
            'Remote debugger is in a background tab',
            'Task orphaned',
            'Warning: componentWillReceiveProps is deprecated',
            'Warning: componentWillMount is deprecated',
            'Warning: ViewPagerAndroid',
        ]);
    }

    componentDidMount() {
        // 初始化 AdManager, 之后才能启动开屏
        ad.AdManager.init();
        // 信息流广告先预加载，提速第一次签到时显示的速度
        ad.AdManager.loadFeedAd();

        // 获取广告开放状态
        service.enableAdvert(data => {
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
        // 检查GQL接口状态
        this.checkServer();
        // 微信注册
        WeChat.registerApp('wx6fee77d331d42a27');
        // 注册全局变量Toast
        global.Toast = this.toast;
        // 禁止横屏
        Orientation.lockToPortrait();

        readPhoneState();

        ad.RewardVideo.loadAd().then(data => {
            // config.rewardVideoAdCache = data;
        });
    }

    checkServer = () => {
        fetch(Config.ServerRoot)
            .then(response => {
                if (response.status === 503) {
                    this.setState({ serverMaintenance: response });
                }
                return response.text();
            })
            .then(responseText => {
                this.setState({
                    responseText: responseText,
                });
            })
            .catch(error => {
                console.warn('server error', error);
            });
    };

    _showMaintenance() {
        const { serverMaintenance, responseText } = this.state;

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
    }

    render() {
        return (
            <Fragment>
                <View style={styles.container} onLayout={config.listenLayoutChange}>
                    <ErrorBoundary>
                        <Apollo checkServer={this.checkServer} />
                    </ErrorBoundary>
                    {this._showMaintenance()}
                    <Toast ref={ref => (this.toast = ref)} />
                </View>
            </Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
    },
    image: {
        bottom: 0,
        height: null,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        width: null,
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
