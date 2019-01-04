import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, Image } from 'react-native';
import RootNavigation from './navigation/RootNavigation';

import ApolloApp from './ApolloApp';
import { Config, Colors, Divice } from './constants';

//redux
import { Provider, connect } from 'react-redux';
import store from './store';
import actions from './store/actions';
import { Storage, ItemKeys } from './store/localStorage';

import codePush from 'react-native-code-push';

const { width, height } = Dimensions.get('window');

class App extends Component {
  state = {
    isLoadingComplete: false
  };

  async componentWillMount() {
    await this._loadResourcesAsync();
  }

  _loadResourcesAsync = async () => {
    let user = await Storage.getItem(ItemKeys.user);
    let isUpdate = await Storage.getItem(ItemKeys.isUpdate);
    store.dispatch(actions.setUser(user));
    if (user && user.token) {
      //缓存里找到已登录用户记录
      store.dispatch(actions.signIn(user));
    }
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    let { isLoadingComplete } = this.state;
    return (
      <View style={styles.container}>
        <Provider store={store}>
          <ApolloApp onReady={this._handleFinishLoading} />
        </Provider>
        {!isLoadingComplete && (
          <View style={styles.appLaunch}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginBottom: 200 }}>
              <Image style={styles.loadingImage} source={require('./assets/images/logo.png')} />
              <Image style={{ width: width - 40, height: (width - 40) / 4, marginTop: 30 }} source={require('./assets/images/name.jpeg')} />
              {
                // <Text style={{ color: Colors.black, fontSize: 20, marginTop: 20 }}>答题赚钱</Text>
              }
            </View>

            <Text style={{ color: Colors.tintFont, fontSize: 15, lineHeight: 20, marginBottom: 5, fontWeight: '300' }}>{Config.AppSlogan}</Text>
            <Text style={{ color: Colors.grey, fontSize: 12, paddingBottom: 30 }}>{Config.AppVersion}</Text>
            {
              // <Text style={{ color: Colors.grey, fontSize: 12, marginBottom: 30 }}>datizhuanqian.com</Text>
            }
          </View>
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
    height,
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFEFE'
  },
  loadingImage: {
    width: (width * 3) / 8,
    height: (width * 3) / 8,
    borderRadius: (width * 3) / 16,
    borderWidth: 2,
    borderColor: Colors.tintGray
  }
});

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
  // installMode: codePush.InstallMode.ON_NEXT_RESUME
};
export default codePush(codePushOptions)(App);
