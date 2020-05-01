import Config from './Config';
import { PxFit, Font, Percent, Colors, Device } from './styles';
import * as Helper from './helper';

import _ from 'lodash';

const Global = global || window || {};

// 设备信息
Global.Device = Device;
// App主题
Global.Theme = Colors;
// // 适配字体
Global.Font = Font;
// // 屏幕适配
Global.Percent = Percent;
// helper
Global.Helper = Helper;
//
Global.PxFit = PxFit;
// App配置
Global.Config = Config;
// 用户token
Global.TOKEN = null;
// lodash
Global.__ = _;
// toast
// Global.Toast = () => null;
