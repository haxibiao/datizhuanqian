import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-boost';
import DeviceInfo from 'react-native-device-info';
import { Config } from 'utils';

let deviceHeaders = {};
deviceHeaders.position = [];
const isEmulator = DeviceInfo.isEmulator();

deviceHeaders.os = Platform.OS; //操作系统
deviceHeaders.build = Config.Build; //手动修改的来自JS的build版本号
deviceHeaders.referrer = Config.AppStore; //应用商店来源
deviceHeaders.version = Config.Version; //手动修改的来自JS的App版本号
deviceHeaders.appid = Config.PackageName; //手动修改的来自JS的包名
deviceHeaders.package = Config.PackageName; //手动修改的来自JS的包名

// var timeId = setInterval(function() {
// 	console.log('异步', Util.getPhoneNumber() );
// }, 3000);

// clearInterval

console.log('DeviceInfo', DeviceInfo.getPhoneNumber());

if (!isEmulator) {
	deviceHeaders.brand = DeviceInfo.getBrand(); //设备品牌
	deviceHeaders.deviceCountry = DeviceInfo.getDeviceCountry(); //国家地区
	deviceHeaders.systemVersion = DeviceInfo.getSystemVersion(); //系统版本
	deviceHeaders.uniqueId = DeviceInfo.getUniqueID(); //uniqueId
	deviceHeaders.deviceId = DeviceInfo.getUniqueID(); //uniqueId  兼容
	DeviceInfo.getIPAddress()
		.then(response => response.toString())
		.then(data => {
			deviceHeaders.ip = data;
		}); //ip地址
	// navigator.geolocation.getCurrentPosition(
	// 	position => {
	// 		deviceHeaders.position = [position.coords.longitude, position.coords.latitude];
	// 	},
	// 	error => {
	// 		deviceHeaders.position = [];
	// 	}
	// ); //定位信息    Api在0.60无法使用，且后端已未对定位信息做需求，所以关闭定位信息获取
}

export function makeClient(user = {}, checkServer) {
	let { token } = user;
	return new ApolloClient({
		uri: Config.ServerRoot + '/graphql',
		// uri: 'http://staging.datizhuanqian.com/graphql',
		request: async operation => {
			operation.setContext({
				headers: {
					token,
					...deviceHeaders
				}
			});
		},
		// Apollo Boost allows you to specify a custom error link for your client
		onError: ({ graphQLErrors, networkError, operation, forward }) => {
			if (graphQLErrors) {
				graphQLErrors.map(error => {
					console.log(`gql error: ${error}`);
				});
			}
			if (networkError) {
				checkServer();
			}
		},
		cache: new InMemoryCache()
	});
}

export { GQL } from 'graphql';
export { Query, Mutation, compose, graphql, withApollo, ApolloProvider } from 'react-apollo';
