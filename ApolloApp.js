import React, { Component } from "react";
import { Platform } from "react-native";
import RootNavigation from "./navigation/RootNavigation";
import Config from "./constants/Config";
import { connect } from "react-redux";

import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";

import DeviceInfo from "react-native-device-info";

class ApolloApp extends Component {
	_makeClient(user) {
		let { token } = user;
		console.log("user", user.token);
		let deviceHeaders = {};

		const isEmulator = DeviceInfo.isEmulator();
		if (!isEmulator) {
			deviceHeaders.os = Platform.OS;
			deviceHeaders.brand = DeviceInfo.getBrand();
			deviceHeaders.build = DeviceInfo.getBuildNumber();
			deviceHeaders.deviceCountry = DeviceInfo.getDeviceCountry(); // "US"
			deviceHeaders.referrer = DeviceInfo.getInstallReferrer(); //能分析出来哪个商店安装的
			deviceHeaders.version = DeviceInfo.getReadableVersion();
			deviceHeaders.systemVersion = DeviceInfo.getSystemVersion();
			deviceHeaders.uniqueId = DeviceInfo.getUniqueID();
		}

		this.client = new ApolloClient({
			uri: "https://datizhuanqian.com/graphql",
			request: async operation => {
				operation.setContext({
					headers: {
						token,
						...deviceHeaders
					}
				});
			},
			cache: new InMemoryCache()
		});
	}

	componentWillMount() {
		let { user = {} } = this.props;
		this.timer = setTimeout(() => {
			this.props.onReady();
		}, 6000);
		this._makeClient(user);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.user !== this.props.user) {
			this._makeClient(nextProps.user);
		}
		return false;
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	render() {
		return (
			<ApolloProvider client={this.client}>
				<RootNavigation />
			</ApolloProvider>
		);
	}
}

export default connect(store => {
	return { user: store.users.user };
})(ApolloApp);
