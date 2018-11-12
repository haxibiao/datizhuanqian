import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, StatusBar } from "react-native";
import RootNavigation from "./navigation/RootNavigation";

//redux
import { Provider, connect } from "react-redux";
import store from "./store";
import actions from "./store/actions";
import { Storage, ItemKeys } from "./store/localStorage";

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Provider store={store}>
          <RootNavigation />
        </Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF0000"
  }
});
