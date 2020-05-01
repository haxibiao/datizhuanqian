import {
    name as Name,
    AppName,
    Version,
    Build,
    SocketServer,
    ServerRoot as serverRoot,
    UploadServer as uploadRoot,
    WithdrawServer,
    SnsServer,
    MutationServer,
    PackageName,
} from '../../app.json';

import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

let AppStore = Config && Config.APP_STORE ? Config.APP_STORE : 'haxibiao'; //应用商店名称
let ServerRoot = Config && Config.SERVER_ROOT ? Config.SERVER_ROOT : serverRoot; //接口地址
let UploadServer = Config && Config.UPLOAD_SERVE ? Config.UPLOAD_SERVE : uploadRoot; //视频上传dizhi

export default {
    Name, //英文名
    AppName, //应用名
    AppStore, //应用商店来源
    ServerRoot, //接口地址
    UploadServer, //视频上传地址
    WithdrawServer, //提现接口
    SnsServer, //SNS类型数据接口
    MutationServer, //只写后端接口地址
    SocketServer, //socket服务地址
    Version, // App版本号  对应android versionName
    Build, // App 构建版本  不与android versionCode一致
    PackageName, // App 包名  对于android applicationId
    AppVersion: Version + '.' + Build, // 用于mattom统计展示的version
};
