import React, { Component } from 'react';
import { Platform } from 'react-native';

import { Config } from './constants';
import { connect } from 'react-redux';
import { Storage, ItemKeys } from './store/localStorage';

import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { CategoriesQuery, QuestionQuery } from './graphql/question.graphql';
import { UserQuery } from './graphql/User.graphql';

import DeviceInfo from 'react-native-device-info';
import MainRouter from './routers/MainRouter';

import JPushModule from 'jpush-react-native';

class Apollo extends Component {
	async _makeClient(user) {
		let { token } = user;

		let server = await Storage.getItem(ItemKeys.server);
		console.log('ApolloserverRoot', server);

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
			uri: server.mainApi + '/graphql',
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

		// 获取id
		// JPushModule.getRegistrationID(registrationId => {
		// 	console.log('registrationId', registrationId);
		// });

		// 接收自定义消息
		// JPushModule.addReceiveCustomMsgListener(message => {
		// 	this.setState({ pushMsg: message });
		// 	console.log('receive pushMsg: ', message);
		// });

		// 接收推送通知
		// JPushModule.addReceiveNotificationListener(message => {
		// 	console.log('receive notification: ', message);
		// });

		// 打开通知
		// JPushModule.addReceiveOpenNotificationListener(map => {
		// 	console.log('Opening notification!');
		// 	console.log('map.extra: ' + map.extras);
		// 	if (Platform.OS === 'android') {
		// 		JPushModule.notifyJSDidLoad(resultCode => console.log(resultCode));
		// 	}
		// });
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
		this.promiseTimer && clearTimeout(this.promiseTimer);
	}

	render() {
		if (!this.client) return null;
		return (
			<ApolloProvider client={this.client}>
				<MainRouter />
			</ApolloProvider>
		);
	}
}

export default connect(store => {
	return { user: store.users.user, server: store.users.server };
})(Apollo);
