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
		console.log('user token:', token);
		let deviceHeaders = {};

		const isEmulator = DeviceInfo.isEmulator();
		if (!isEmulator) {
			deviceHeaders.os = Platform.OS; //操作系统
			deviceHeaders.brand = DeviceInfo.getBrand(); //设备品牌
			deviceHeaders.build = Config.Build; //手动修改的build版本号
			deviceHeaders.deviceCountry = DeviceInfo.getDeviceCountry(); //国家

			//不能分析出来哪个中国商店安装的，只适合google play的referer获取
			// deviceHeaders.referrer = DeviceInfo.getInstallReferrer();

			//根据不同的.env文件打包不同的apk，方便追踪商店流量
			deviceHeaders.referrer = Config.AppStore;

			deviceHeaders.version = DeviceInfo.getVersion(); //版本号
			deviceHeaders.systemVersion = DeviceInfo.getSystemVersion(); //系统版本
			deviceHeaders.uniqueId = DeviceInfo.getUniqueID(); //uniqueId
		}

		if (!this.cache) {
			console.log('第一次创建cache!!!');
			this.cache = new InMemoryCache();
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
			cache: this.cache
		});
	}

	componentWillMount() {
		let { user = {} } = this.props;
		this.timer = setTimeout(() => {
			this.props.onReady();
		}, 5000);
		// this._makeClient(user);
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.user !== this.props.user) {
			console.log('make client user:', nextProps.user);
			this._makeClient(nextProps.user);
		}
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}

	render() {
		if (!this.client) return null;
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
