import React, { Component } from 'react';
import { Platform } from 'react-native';
import RootNavigation from './navigation/RootNavigation';
import Config from './constants/Config';
import { connect } from 'react-redux';

import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';

import DeviceInfo from 'react-native-device-info';

class ApolloApp extends Component {
	_makeClient(user) {
		let { token } = user;
		console.log('user', user.token);
		let deviceHeaders = {};

		const isEmulator = DeviceInfo.isEmulator();
		if (!isEmulator) {
			deviceHeaders.os = Platform.OS;
			deviceHeaders.brand = DeviceInfo.getBrand();
			deviceHeaders.build = DeviceInfo.getBuildNumber();
			deviceHeaders.deviceCountry = DeviceInfo.getDeviceCountry(); // "US"

			//不能分析出来哪个中国商店安装的，只适合google play的referer获取
			deviceHeaders.referrer = DeviceInfo.getInstallReferrer();

			//根据不同的.env文件打包不同的apk，方便追踪商店流量
			deviceHeaders.referrer = Config.AppStore;

			deviceHeaders.version = DeviceInfo.getReadableVersion();
			deviceHeaders.systemVersion = DeviceInfo.getSystemVersion();
			deviceHeaders.uniqueId = DeviceInfo.getUniqueID();
		}

		this.client = new ApolloClient({
			uri: Config.ServerRoot + '/graphql',
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
		}, 5000);
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
