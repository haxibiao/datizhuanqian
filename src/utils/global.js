import { Dimensions, PixelRatio, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';
import Config from './Config';
import Theme from './Theme';
import * as Scale from './Scale';
import * as Helper from './helper';

const { height, width } = Dimensions.get('window');

const Global = global || window || {};

const device = {
    WIDTH: width,
    HEIGHT: height,
    OS: Platform.OS,
    IOS: Platform.OS === 'ios',
    Android: Platform.OS === 'android',
    SystemVersion: DeviceInfo.getSystemVersion(),
    PixelRatio: PixelRatio.get(), // 获取屏幕分辨率
    PhoneNumber: DeviceInfo.getPhoneNumber(),
};
// 设备信息
Global.Device = device;
// App主题
Global.Theme = Theme;
// // 适配字体
// Global.Font = Helper.FontSize;
// // 屏幕适配
// Global.PxDp = Helper.PxDp;
// helper
Global.Helper = Helper;
//
Global.PxFit = Scale.PxFit;

// App配置
Global.Config = Config;
// 用户token
Global.TOKEN = null;
// lodash
Global.__ = _;
// toast
// Global.Toast = () => null;
