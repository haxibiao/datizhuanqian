import { Platform } from 'react-native';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-boost';
import DeviceInfo from 'react-native-device-info';
import { Config } from 'utils';
import ApolloApp from './ApolloApp';

const deviceHeaders = {
    os: '',
    build: '',
    referrer: '',
    version: '',
    appid: '',
    package: '',
    brand: '',
    deviceCountry: '',
    systemVersion: '',
    uniqueId: '',
    deviceId: '',
    ip: '',
};

// const deviceHeaders = {};

const isEmulator = DeviceInfo.isEmulator();

deviceHeaders.os = Platform.OS; // 操作系统
deviceHeaders.build = Config.Build; // 手动修改的build版本号
deviceHeaders.referrer = Config.AppStore; // 应用商店来源
deviceHeaders.version = Config.Version; // 手动修改的App版本号
deviceHeaders.appid = Config.PackageName; // 手动修改的包名
deviceHeaders.package = Config.PackageName; // 手动修改的包名

if (!isEmulator) {
    deviceHeaders.brand = DeviceInfo.getBrand(); // 设备品牌
    deviceHeaders.deviceCountry = DeviceInfo.getDeviceCountry(); // 国家地区
    deviceHeaders.systemVersion = DeviceInfo.getSystemVersion(); // 系统版本
    deviceHeaders.uniqueId = DeviceInfo.getUniqueID(); // uniqueId
    deviceHeaders.deviceId = DeviceInfo.getUniqueID(); // uniqueId  兼容
    DeviceInfo.getIPAddress()
        .then(response => response.toString())
        .then(data => {
            deviceHeaders.ip = data;
        }); // ip地址
}

export function makeClient(user = {}, checkServer: () => void) {
    const { token } = user;
    return new ApolloClient({
        uri: Config.ServerRoot + '/graphql',
        // uri: 'http://staging.datizhuanqian.com/graphql',
        request: async operation => {
            operation.setContext({
                headers: {
                    token,
                    ...deviceHeaders,
                },
            });
        },
        // Apollo Boost allows you to specify a custom error link for your client
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors) {
                graphQLErrors.map(error => {
                    console.log('gql error', error);
                });
            }
            if (networkError) {
                checkServer();
            }
        },
        cache: new InMemoryCache(),
    });
}

export { GQL } from 'gqls';
export { Query, Mutation, compose, graphql, withApollo, ApolloProvider } from 'react-apollo';
export * from '@apollo/react-hooks';
