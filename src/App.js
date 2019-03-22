/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:06:11
 */

import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Dimensions, NetInfo, YellowBox } from 'react-native';

import { Toast, ErrorBoundary, Appintroduction } from './components';
import { Theme, Config, SCREEN_WIDTH, SCREEN_HEIGHT } from './utils';

import { Provider, connect } from 'react-redux';
import store from './store';
import actions from './store/actions';
import { users } from './store/state/users';
import { Storage, ItemKeys } from './store/localStorage';

import codePush from 'react-native-code-push';
import Apollo from './Apollo';

class App extends Component {
	toast: Toast;

	constructor(props) {
		super(props);
		this.state = {
			ServerRoot: 'https://datizhuanqian.com'
		};
	}

	componentWillMount() {
		this.loadUserState();
		// this.loadServerRootState();
	}

	componentDidMount() {
		global.Toast = this.toast;
	}

	loadUserState = async () => {
		let user = await Storage.getItem(ItemKeys.user);
		store.dispatch(actions.setUser(user));
		console.log('useruser', user);
		if (user && user.token) {
			global.TOKEN = user.token;

			store.dispatch(actions.signIn(user));
		} else {
			global.TOKEN = null;
		}
	};

	loadServerRootState = async () => {
		let server = await Storage.getItem(ItemKeys.server);
		let serverJson = {};
		serverJson.mainApi = Config.ServerRoot;
		serverJson.spareApi = '';

		//如果第一次启动app 服务器就无法连接，则会取不到备用服务器地址
		console.log('server', server);

		if (server && server.mainApi) {
			fetch(server.mainApi + '/server')
				//检查redux中主域名(Config.SERVER_ROOT)
				.then(response => response.json())
				.then(data => {
					console.log('data', data.domain[data.domain.length - 1]);
					serverJson.mainApi = server.mainApi;
					serverJson.spareApi = data.domain[data.domain.length - 1];
					//应替换为data返回json中的备用域名
					store.dispatch(actions.updateServer(serverJson));
				})
				.catch(err => {
					let info = err.toString().indexOf('failed');
					if (info > -1) {
						serverJson.mainApi = server.spareApi;
						serverJson.spareApi = server.mainApi;
						//应替换为storage json 中的备用域名
						store.dispatch(actions.updateServer(serverJson));
						//存在备用域名  则将redux 中主域名更新
					}
				});
		} else {
			fetch(serverJson.mainApi + '/server')
				//检查主域名(Config.SERVER_ROOT)
				.then(response => response.json())
				.then(data => {
					serverJson.spareApi = data.domain[data.domain.length - 1];
					//应替换为data返回json中的备用域名
					store.dispatch(actions.updateServer(serverJson));
					// store.dispatch(actions.setServer(serverJson));
				})
				.catch(err => {
					this.timer = setTimeout(() => {
						// Methods.toast('网络异常，请检查网络或重启APP', -90);
					}, 6000);
					let info = err.toString().indexOf('failed');
					// Methods.Toast('连接服务器好像出了点问题，请重启APP');
					if (info > -1) {
						//如何第一次启动就网络异常，为防止启动异常，暂时写死api地址
						serverJson.mainApi = 'https://datizhuanqian.cn';
						serverJson.spareApi = 'https://datizhuanqian.com';
						//应替换为storage json 中的备用域名
						store.dispatch(actions.updateServer(serverJson));
						//存在备用域名  则将redux 中主域名更新
					}
				});
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<Provider store={store}>
					<ErrorBoundary>
						<Apollo />
					</ErrorBoundary>
				</Provider>
				<Toast ref={ref => (this.toast = ref)} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFF'
	}
});

let codePushOptions = {
	checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
	// installMode: codePush.InstallMode.ON_NEXT_RESUME
};

export default codePush(codePushOptions)(App);
