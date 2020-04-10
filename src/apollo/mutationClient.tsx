import { Platform } from 'react-native';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-boost';
import DeviceInfo from 'react-native-device-info';
import { Config } from 'utils';
import { Matomo } from 'native';

import base64 from 'react-native-base64';

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

let startToday = new Date();
startToday.setHours(10);
startToday.setMinutes(0);
startToday.setSeconds(0);
startToday.setMilliseconds(0);

let endToday = new Date();
endToday.setHours(12);
endToday.setMinutes(0);
endToday.setSeconds(0);
endToday.setMilliseconds(0);

const startTimestamp = startToday.getTime() - 24 * 60 * 60 * 1000;
const endTimestamp = endToday.getTime() - 24 * 60 * 60 * 1000;

console.log('startTimestamp', startTimestamp, endTimestamp);

export function makeMutationClient(user: { id?: any; token?: any }, checkServer: () => void) {
    const { token } = user;

    Matomo.setUserId(user.id || 0);
    Matomo.setCustomDimension(1, deviceHeaders.os);
    Matomo.setCustomDimension(2, deviceHeaders.referrer);
    Matomo.setCustomDimension(3, deviceHeaders.version);
    Matomo.setCustomDimension(4, deviceHeaders.build);
    //新老用户类型，目前后端事件在区分...
    Matomo.setCustomDimension(6, deviceHeaders.brand);
    //埋点鉴权用的headers
    let authHeaders = {
        //前面三个只用来验证防火墙是否挂了参数过来
        dzuid: base64.encode(Config.Build + '_' + Config.AppStore),
        dztoken: base64.encode(deviceHeaders.os + '_' + deviceHeaders.systemVersion),
        dzuuid: base64.encode(Config.PackageName + '_' + Config.Version),

        //后面三个后端会用来封号
        dz_uid: base64.encode('uid_' + user.id),
        dz_token: base64.encode('token_' + user.token),
        dz_uuid: base64.encode('uuid_' + deviceHeaders.uniqueId),
    };

    let headers = {
        ...deviceHeaders,
        ...authHeaders,
    };

    let uuid = deviceHeaders.uniqueId; //明文传uuid
    let time = Helper.getRndInteger({ min: startTimestamp, max: endTimestamp }); //随机取一天前的某时间（1天前的中午10-12点），后端可以校检，WAF可以查看拦截
    let brand = base64.encode(deviceHeaders.brand); //看手机型号
    let osversion = base64.encode(deviceHeaders.systemVersion); //看安卓版本
    let ip = deviceHeaders.ip; // ip明文
    let encoded_version = '1000000' + Config.Version + '0005821';
    //后端我来decode版本信息鉴权，注意v不是缺失=号，我是故意的，参数名就是关键信息
    let authQuery =
        'v' + encoded_version + '&u=' + uuid + '&t=' + time + '&b=' + brand + '&o=' + osversion + '&i=' + ip;

    console.log('authQuery', authQuery);
    console.log('headers', headers);

    return new ApolloClient({
        uri: Config.ServerRoot + '/graphql?' + authQuery,
        // uri: 'http://staging.datizhuanqian.com/graphql',
        request: async operation => {
            operation.setContext({
                headers: {
                    token,
                    ...headers,
                },
            });
        },
        // Apollo Boost allows you to specify a custom error link for your client
        onError: ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors) {
                graphQLErrors.map(error => {
                    console.log('mutation client gql error', error);
                });
            }
            if (networkError) {
                checkServer();
            }
        },
        cache: new InMemoryCache(),
    });
}
