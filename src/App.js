import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Dimensions, NetInfo } from 'react-native';

import Apollo from './Apollo';
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
      introImages: '',
      isConnected: true
    };
  }

  componentWillMount() {
    this.loadUserState();
    //用户状态加载
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected) {
        this.getAppIntro();
      } else {
        this.setState({
          isConnected: false
        });
      }
    });
  }

  loadUserState = async () => {
    let user = await Storage.getItem(ItemKeys.user);
    store.dispatch(actions.setUser(user));
    if (user && user.token) {
      //缓存里找到已登录用户记录
      store.dispatch(actions.signIn(user));
    }
  };

  getAppIntro = async () => {
    this.setState({
      storageVersionNumber: (await Storage.getItem(ItemKeys.version)) ? await Storage.getItem(ItemKeys.version) : 1
    });
    //获取localstorage version 第一次启动APP设置初始值1
    if (this.state.storageVersionNumber < Config.AppVersionNumber) {
      //减少请求次数  如果storageVersionNuber小于当前app的version   证明没有浏览过新版本app介绍页 发起获取介绍页请求
      //大于等于则跳过显示原始启动页
      Promise.race([
        fetch(Config.ServerRoot + '/api/app-loading-image'),
        new Promise(function(resolve, reject) {
          setTimeout(() => reject(new Error('request timeout')), 2000);
        })
      ])
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
    } else {
      this.setState({
        isConnected: false
      });
    }
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  handleIntro = () => {
    this.setState({ showHome: true });
  };

  render() {
    let { isLoadingComplete, showHome, introImages, storageVersionNumber, isConnected } = this.state;
    return (
      <View style={styles.container}>
        <Provider store={store}>
          <Apollo onReady={this.handleFinishLoading} />
        </Provider>
        {isConnected ? (
          //判断是否联网 有网就需要判断是否介绍图 以及版本号  无网不请求数据
          storageVersionNumber && introImages ? (
            //判断异步加载的 storgeVersion introImages 值是否拿到  没有值得时候拿白底渲染，防止UI跳动。
            introImages.length > 1 ? (
              //判断介绍图的数量
              !showHome && (
                <AppIntro
                  showHome={showHome}
                  method={this.handleIntro}
                  introImages={introImages}
                  actions={() => {
                    store.dispatch(actions.updateVersion(Config.AppVersionNumber));
                  }}
                />
                //浏览完介绍页之后会将版本号保存到storage中，只要不卸载APP，当前版本的介绍页就只渲染一次
                //介绍页
              )
            ) : (
              !isLoadingComplete && <AppIntro loading={true} /> //启动页
            )
          ) : (
            <View style={styles.appLaunch} /> //预留底色
          )
        ) : (
          !isLoadingComplete && <AppIntro loading={true} /> //启动页
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
    height: StatusBar.currentHeight > 35 ? height + StatusBar.currentHeight : height,
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
