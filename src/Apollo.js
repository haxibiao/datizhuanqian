import React, { Component } from 'react';
import { Platform } from 'react-native';

import { Config } from './constants';
import { connect } from 'react-redux';

import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { CategoriesQuery, QuestionQuery } from './graphql/question.graphql';
import { UserQuery } from './graphql/User.graphql';

import DeviceInfo from 'react-native-device-info';
import MainRouter from './routers/MainRouter';

class Apollo extends Component {
	_makeClient(user) {
		let { token } = user;
		let deviceHeaders = {};
		const isEmulator = DeviceInfo.isEmulator();
		if (!isEmulator) {
			deviceHeaders.os = Platform.OS; //操作系统
			deviceHeaders.brand = DeviceInfo.getBrand(); //设备品牌
			deviceHeaders.build = Config.Build; //手动修改的build版本号
			deviceHeaders.deviceCountry = DeviceInfo.getDeviceCountry(); //国家
			deviceHeaders.referrer = Config.AppStore; //根据不同的.env文件打包不同的apk，方便追踪应用商店流量
			deviceHeaders.version = DeviceInfo.getVersion(); //版本号
			deviceHeaders.systemVersion = DeviceInfo.getSystemVersion(); //系统版本
			deviceHeaders.uniqueId = DeviceInfo.getUniqueID(); //uniqueId
			DeviceInfo.getIPAddress()
				.then(response => response.toString())
				.then(data => {
					deviceHeaders.ip = data;
				}); //ip地址
		}

		if (!this.cache) {
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
			cache: new InMemoryCache()
		});
	}

	componentWillMount() {
		let { user = {} } = this.props;
		this._makeClient(user);
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.user !== this.props.user) {
			this._makeClient(nextProps.user);
		}
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
		this.promiseTimer && clearTimeout(this.promiseTimer);
	}

	render() {
		// if (!this.client) return null;
		return (
			<ApolloProvider client={this.client}>
				<MainRouter />
			</ApolloProvider>
		);
	}
}

export default connect(store => {
	return { user: store.users.user };
})(Apollo);
