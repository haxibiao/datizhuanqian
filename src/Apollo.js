/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:06:25
 */
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Config } from './utils';
import { connect } from 'react-redux';
import { Storage, ItemKeys } from './store/localStorage';

import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { CategoriesQuery, QuestionQuery } from './assets/graphql/question.graphql';
import { UserQuery } from './assets/graphql/User.graphql';

import DeviceInfo from 'react-native-device-info';
import AppRouter from './routers';

import JPushModule from 'jpush-react-native';

class Apollo extends Component {
	async _makeClient(user) {
		let { token } = user;

		// let server = await Storage.getItem(ItemKeys.server);

		// let ServerRoot = Config.ServerRoot;
		// if (server && server.mainApi) {
		// 	ServerRoot = server.mainApi;
		// }

		let deviceHeaders = {};
		const isEmulator = DeviceInfo.isEmulator();
		if (!isEmulator) {
			deviceHeaders.os = Platform.OS; //操作系统
			deviceHeaders.brand = DeviceInfo.getBrand(); //设备品牌
			deviceHeaders.build = Config.Build; //手动修改的build版本号
			deviceHeaders.deviceCountry = DeviceInfo.getDeviceCountry(); //国家
			deviceHeaders.referrer = Config.AppStore; //根据不同的.env文件打包不同的apk，方便追踪应用商店流量

			deviceHeaders.systemVersion = DeviceInfo.getSystemVersion(); //系统版本
			deviceHeaders.uniqueId = DeviceInfo.getUniqueID(); //uniqueId
			DeviceInfo.getIPAddress()
				.then(response => response.toString())
				.then(data => {
					deviceHeaders.ip = data;
				}); //ip地址
		}
		deviceHeaders.version = '1.4.0'; //版本号
		if (!this.cache) {
			this.cache = new InMemoryCache();
		}

		this.client = new ApolloClient({
			uri: 'https://datizhuanqian.cn' + '/graphql',
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
		// if (nextProps.server !== this.props.server) {
		// 	console.log('c1', nextProps.user, nextProps.server);
		// 	this._makeClient(nextProps.user, nextProps.server);
		// }
	}

	componentDidMount() {
		if (Platform.OS === 'android') {
			JPushModule.notifyJSDidLoad(resultCode => {
				if (resultCode === 0) {
				}
			});
		}

		// 增加tag
		JPushModule.addTags([Config.AppStore], success => {
			console.log('success', success);
		});
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
		this.promiseTimer && clearTimeout(this.promiseTimer);
	}

	render() {
		// if (!this.client) return null;

		return (
			<ApolloProvider client={this.client}>
				<AppRouter />
			</ApolloProvider>
		);
	}
}

export default connect(store => {
	return { user: store.users.user, server: store.users.server };
})(Apollo);
