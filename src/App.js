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

import Orientation from 'react-native-orientation';
import codePush from 'react-native-code-push';
import { ttad, WeChat } from 'native';
import { ISIOS, Config, PxFit, Theme } from 'utils';

import service from 'service';
import { checkUpdate } from 'common';

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
            'Remote debugger is in a background tab',
            'Task orphaned',
            'Warning: componentWillReceiveProps is deprecated',
            'Warning: componentWillMount is deprecated',
            'Warning: ViewPagerAndroid',
        ]);
    }

    componentDidMount() {
        // 恢复用户身份信息
        app.recallUser();
        // 恢复缓存
        app.recallCache();
        // 获取广告开放状态
        service.enableAdvert(data => {
            config.saveAdvertConfig(data);
            if (data.enable_splash) {
                // 开屏广告因为时机问题直接在此判断了
                // ttad.Splash.loadSplashAd();
            }
        });

        ttad.Splash.loadSplashAd();
        // 检查更新
        checkUpdate('autoCheck');
        // 检查GQL接口状态
        this.checkServer();
        // 微信注册
        if (!ISIOS) {
            WeChat.registerApp('wx6fee77d331d42a27');
        }
        // 注册全局变量Toast
        global.Toast = this.toast;
        // 禁止横屏
        Orientation.lockToPortrait();
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
    maintenance: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: null,
        height: null,
    },
    textWrap: {
        position: 'absolute',
        top: '65%',
        left: 0,
        right: 0,
        paddingHorizontal: PxFit(20),
        alignItems: 'center',
    },
    text: {
        fontSize: PxFit(15),
        lineHeight: PxFit(18),
        color: Theme.subTextColor,
    },
});

const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export default codePush(codePushOptions)(App);
