/*
 * @flow
 * created by wyk made in 2018-12-05 21:08:02
 */
import { Dimensions, Platform } from 'react-native';
import Api from './Api';
import Config from './Config';
import Theme from './Theme';
import Tools from './Tools';
import { WPercent, HPercent, PxFit, FontSize } from './Scale';

const { height, width } = Dimensions.get('window');

const ISIOS = Platform.OS === 'ios';
const ISAndroid = Platform.OS === 'android';
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;
const NAVBAR_HEIGHT = Theme.navBarContentHeight + Theme.statusBarHeight;
const CONTENT_HEIGHT = SCREEN_HEIGHT - Theme.HOME_INDICATOR_HEIGHT - PxFit(NAVBAR_HEIGHT);

export {
    // IOS系统
    ISIOS,
    // 安卓系统
    ISAndroid,
    // 屏幕宽度
    SCREEN_WIDTH,
    // 屏幕高度
    SCREEN_HEIGHT,
    // navBar高度
    NAVBAR_HEIGHT,
    // 内容高度
    CONTENT_HEIGHT,
    // 后端接口/native接口
    Api,
    // APP配置
    Config,
    // APP主题
    Theme,
    // 工具函数
    Tools,
    // 宽度百分比适配
    WPercent,
    // 高度百分比适配
    HPercent,
    // 分辨率适配
    PxFit,
    // 字体适配
    FontSize,
};
