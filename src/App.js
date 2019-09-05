/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, Component } from 'react';
import { StyleSheet, YellowBox, View, Text, StatusBar, Platform } from 'react-native';
import { Toast, ErrorBoundary } from 'components';
import { app, config, keys, storage } from 'store';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions
} from 'react-native/Libraries/NewAppScreen';

import Orientation from 'react-native-orientation';
import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';
import { TtAdvert, WeChat } from 'native';
import { ISIOS, Config, Api } from 'utils';
import NetInfo from '@react-native-community/netinfo';
import { Util } from 'native';
import { rest } from 'api';

import Apollo from './Apollo';

class App extends Component {
  toast: Toast;
  constructor(props) {
    super(props);
    global.TOKEN = null;

    YellowBox.ignoreWarnings([
      'Remote debugger is in a background tab',
      'Task orphaned',
      'Warning: componentWillReceiveProps is deprecated',
      'Warning: componentWillMount is deprecated',
      'Warning: ViewPagerAndroid'
    ]);
  }

  componentDidMount() {
    //恢复用户身份信息
    app.recallUser();
    //恢复缓存
    app.recallCache();
    //获取广告开放状态
    rest.enableAdvert(data => {
      config.saveAdvertConfig(data);
      if (data.enable_splash) {
        //开屏广告因为时机问题直接在此判断了
        TtAdvert.Splash.loadSplashAd();
      }
    });
    //检查更新
    Api.checkUpdate('autoCheck');
    //检查GQL接口状态
    this.checkServer();
    //微信注册
    if (!ISIOS) {
      WeChat.registerApp('wx6fee77d331d42a27');
    }
    //注册全局变量Toast
    global.Toast = this.toast;
    //禁止横屏
    Orientation.lockToPortrait();
  }

  checkServer = () => {
    fetch(Config.ServerRoot)
      .then(response => {
        if (response.status === 503) {
          this.setState({ serverMaintenance: response });
        }
        console.log('respose', response);
      })
      .catch(error => {
        console.log('server error', error);
      });
  };

  render() {
    return (
      <Fragment>
        <View style={styles.container} onLayout={config.listenLayoutChange}>
          <ErrorBoundary>
            <Apollo checkServer={this.checkServer} />
          </ErrorBoundary>
          <Toast ref={ref => (this.toast = ref)} />
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  }
});

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};

export default codePush(codePushOptions)(App);
