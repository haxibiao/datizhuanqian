import {
    AppName,
    AppVersionNumber,
    Version,
    Build,
    SocketServer,
    ServerRoot as serverRoot,
    UploadServer as uploadRoot,
    PackageName,
} from '../../app.json';

import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

let AppStore = Config && Config.APP_STORE ? Config.APP_STORE : 'haxibiao'; //应用商店名称
let ServerRoot = Config && Config.SERVER_ROOT ? Config.SERVER_ROOT : serverRoot; //接口地址
let UploadServer = Config && Config.UPLOAD_SERVE ? Config.UPLOAD_SERVE : uploadRoot; //视频上传dizhi

export default {
    AppName, //应用名
    AppStore, //应用商店来源
    ServerRoot, //接口地址
    UploadServer, //视频上传地址
    SocketServer, //socket服务地址
    Version, // App版本号  对应android versionName
    AppVersionNumber, // float类型的版本号  用于检查版本更新   小数点后只能保留一位，区间为1~9
    Build, // App 构建版本  不与android versionCode一致
    PackageName, // App 包名  对于android applicationId
    AppVersion: Version + '.' + Build, // 用于mattom统计展示的version
};
