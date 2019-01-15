import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, Image, NetInfo } from 'react-native';
import RootNavigation from './navigation/RootNavigation';

import ApolloApp from './ApolloApp';
import { Config, Colors, Divice, Methods } from './constants';
import { AppIntro } from './components/Universal';

//redux
import { Provider, connect } from 'react-redux';
import store from './store';
import actions from './store/actions';
import { Storage, ItemKeys } from './store/localStorage';

import { Query, withApollo, client } from 'react-apollo';

import codePush from 'react-native-code-push';

const { width, height } = Dimensions.get('window');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      showHome: false,
      storageVersionNumber: '',
      introImages: ''
    };
  }

  componentWillMount() {
    //用户状态加载
    this._loadResourcesAsync();

    //首先检查手机网络状态  online 按照正常流程   offline强制使用原始启动页
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected) {
        this.loadIntro();
      } else {
        this.setState({
          storageVersionNumber: 100,
          introImages: []
        });
        //暂时方法
      }
    });
  }

  _loadResourcesAsync = async () => {
    let user = await Storage.getItem(ItemKeys.user);
    store.dispatch(actions.setUser(user));
    if (user && user.token) {
      //缓存里找到已登录用户记录
      store.dispatch(actions.signIn(user));
    }
  };

  loadIntro = async () => {
    this.setState({
      storageVersionNumber: (await Storage.getItem(ItemKeys.version)) ? await Storage.getItem(ItemKeys.version) : 1
    });
    fetch(Config.ServerRoot + '/api/app-loading-image')
      .then(response => response.json())
      .then(data => {
        this.setState({
          introImages: data
        });
      })
      .catch(err => {
        this.setState({
          introImages: []
        });
      });

    //获取localstorage version 第一次启动APP设置初始值1
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  handleIntro = () => {
    this.setState({ showHome: true });
  };

  render() {
    let { isLoadingComplete, showHome, introImages, storageVersionNumber } = this.state;

    return (
      <View style={styles.container}>
        <Provider store={store}>
          <ApolloApp onReady={this._handleFinishLoading} />
        </Provider>
        {
          //为了防止出现闪屏首先判断storageVersionNumber和introImages是否有数据
          //再判断介绍图是否有两张以上 并且localstorage version 小于 app version显示启动介绍页
          //反之显示APP加载页
          //无网状态下只渲染原始启动页  并且启动介绍页对每个版本只渲染一次
        }

        {storageVersionNumber && introImages ? (
          introImages.length > 1 && storageVersionNumber < Config.AppVersionNumber ? (
            !showHome && (
              <AppIntro
                showHome={showHome}
                method={this.handleIntro}
                introImages={introImages}
                actions={() => {
                  store.dispatch(actions.updateVersion(Config.AppVersionNumber));
                }}
              />
              //介绍页
            )
          ) : (
            !isLoadingComplete && <AppIntro loading={true} /> //加载页
          )
        ) : (
          <View style={styles.appLaunch} /> //预留底色
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  appLaunch: {
    width,
    height:StatusBar.currentHeight > 35 ? height + StatusBar.currentHeight : height,,
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFEFE'
  }
});

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
  // installMode: codePush.InstallMode.ON_NEXT_RESUME
};
export default codePush(codePushOptions)(App);
