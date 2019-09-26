/*
 * @flow
 * created by wyk made in 2019-07-01 16:29:14
 */
import { Platform } from 'react-native';
import { observable, action, runInAction } from 'mobx';
import { ItemKeys, Storage, SystemSettings } from './storage';
import { Theme, PxFit, Config, SCREEN_WIDTH, SCREEN_HEIGHT } from '../utils';
import { NavigationActions } from 'react-navigation';

import NetInfo from '@react-native-community/netinfo';

//系统配置
class config {
    @observable client: Object = {};
    @observable navigation: any;
    @observable systemSettings: Object = {};
    @observable screenWidth: number = SCREEN_WIDTH;
    @observable screenHeight: number = SCREEN_HEIGHT;
    @observable connectionInfoType: string;
    @observable deviceOffline: boolean;
    @observable isFullScreen: boolean = false;
    @observable networkState: boolean = true;
    @observable enableSplash: boolean = true; //开启开屏广告
    @observable enableQuestion: boolean = false; //开启答题时的广告
    @observable enableReward: boolean = false; //开启激励视频
    @observable enableFeed: boolean = false; //开启信息流广告
    @observable enableBanner: boolean = false; //开启Banner广告
    @observable disableAd: boolean = false;

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
    async systemSetting(payload: Object) {
        let { settingItem, settingItemValue } = payload;
        await Storage.setItem(SystemSettings[settingItem], settingItemValue);
    }

    @action.bound
    async restoreSystemSetting() {
        var keys = Object.keys(SystemSettings);
        for (const key of keys) {
            let value = await Storage.getItem(key);
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

    //监听视图宽高
    @action.bound
    listenLayoutChange(event) {
        let { width, height } = event.nativeEvent.layout;
        this.screenWidth = width;
        this.screenHeight = height;
    }

    @action.bound
    saveAdvertConfig(data) {
        console.log('saveAdvertConfig data', data);
        this.enableSplash = data.enable_splash;
        this.enableQuestion = data.enable_question;
        this.enableReward = data.enable_reward;
        this.enableFeed = data.enable_feed;
        this.enableBanner = data.enable_banner;
        this.disableAd = data.disable[Config.AppStore];
        console.log('this.disableAd', this.disableAd);
    }
}

export default new config();
