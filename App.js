import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, StatusBar, Dimensions, Image } from "react-native";
import RootNavigation from "./navigation/RootNavigation";

import ApolloApp from "./ApolloApp";
import { Config, Colors, Divice } from "./constants";

//redux
import { Provider, connect } from "react-redux";
import store from "./store";
import actions from "./store/actions";
import { Storage, ItemKeys } from "./store/localStorage";

const { width, height } = Dimensions.get("window");

class App extends Component {
  state = {
    isLoadingComplete: false
  };

  async componentWillMount() {
    // YellowBox.ignoreWarnings(["Task orphaned"]);
    // Orientation.lockToPortrait();
    await this._loadResourcesAsync();
  }

  _loadResourcesAsync = async () => {
    let user = await Storage.getItem(ItemKeys.user);
    console.log("storageuser", user);
    if (user) {
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
            <View style={{ alignItems: "center", justifyContent: "center", flex: 1, marginBottom: 150 }}>
              <Image style={styles.loadingImage} source={require("./assets/images/logo.png")} />
              <Text style={{ color: Colors.black, fontSize: 20, marginTop: 20 }}>答题赚钱</Text>
            </View>

            <Text style={{ color: Colors.grey, fontSize: 12, marginBottom: 30 }}>datizhuanqian.com</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF0000"
  },
  appLaunch: {
    width,
    height,
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  loadingImage: {
    width: (width * 2) / 7,
    height: (width * 2) / 7
  }
});

export default App;
