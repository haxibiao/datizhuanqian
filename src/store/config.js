/*
 * @flow
 * created by wyk made in 2019-07-01 16:29:14
 */
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { observable, action } from 'mobx';
import { Storage, SystemSettings } from './storage';
import Config from '../utils/Config';
import { NavigationActions } from 'react-navigation';

import NetInfo from '@react-native-community/netinfo';

// 系统配置
class config {
    @observable client: Record<string, any> = {};
    @observable navigation: any;
    @observable systemSettings: Record<string, any> = {};
    @observable screenWidth: number = width;
    @observable screenHeight: number = height;
    @observable connectionInfoType: string;
    @observable deviceOffline: boolean;
    @observable isFullScreen: boolean = false;
    @observable networkState: boolean = true;
    @observable enableSplash: boolean = true; // 开启开屏广告
    @observable enableQuestion: boolean = false; // 开启答题时的广告
    @observable enableReward: boolean = false; // 开启激励视频
    @observable enableFeed: boolean = false; // 开启信息流广告
    @observable enableBanner: boolean = false; // 开启Banner广告
    @observable enableDrawFeed: boolean = false;
    @observable disableAd: boolean = false;
    @observable rewardVideoAdCache: boolean = false; //激励视频广告cache 过期时间60min
    @observable fullScreenVideoAdCache: boolean = false;
    @observable taskConfig: object = {};

    constructor() {
        NetInfo.addEventListener(this.handleConnectivityChange);
    }

    @action.bound
    handleConnectivityChange(connectionInfo) {
        this.connectionInfoType = connectionInfo.type;
        this.deviceOffline = connectionInfo.type === 'none';
    }

    componentWillUnMount() {
        NetInfo.removeEventListener(this.handleConnectivityChange);
    }

    @action.bound
    saveApolloClient(client) {
        this.client = client;
    }

    @action.bound
    updateUser(key: string, value: string) {
        this.personal[key] = value;
    }

    @action.bound
    async systemSetting(payload: Record<string, any>) {
        const { settingItem, settingItemValue } = payload;
        await Storage.setItem(SystemSettings[settingItem], settingItemValue);
    }

    @action.bound
    async restoreSystemSetting() {
        const keys = Object.keys(SystemSettings);
        for (const key of keys) {
            const value = await Storage.getItem(key);
            if (value) {
                this.systemSettings[key] = value;
            }
        }
    }

    @action.bound
    navigateAction(action) {
        console.log('this.navigation', this.navigation);
        this.navigation.dispatch(NavigationActions.navigate(action));
    }

    // 监听视图宽高
    @action.bound
    listenLayoutChange(event) {
        const { width, height } = event.nativeEvent.layout;
        this.screenWidth = width;
        this.screenHeight = height;
    }

    @action.bound
    saveAdvertConfig(data) {
        this.enableSplash = data.enable_splash;
        this.enableQuestion = data.enable_question;
        this.enableReward = data.enable_reward;
        this.enableFeed = data.enable_feed;
        this.enableBanner = data.enable_banner;
        this.enableDrawFeed = data.enable_drawfeed;
        this.disableAd = data.disable[Config.AppStore];
    }

    @action.bound
    saveTaskConfig(data) {
        this.taskConfig = data;
    }
}

export default new config();
