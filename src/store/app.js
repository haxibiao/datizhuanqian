import { observable, action, runInAction } from 'mobx';
import user from './user';
import { keys, storage } from './storage';
import { Config } from 'utils';

class app {
    @observable me = {};
    @observable login = false;
    @observable fetching = false;
    @observable contributeRuleRead = false;
    @observable echo = null;
    @observable resetVersion = 1;
    @observable userCache = null;
    @observable taskCache = null;
    @observable categoryCache = null;
    @observable noTicketTips = true;
    @observable unreadNotice = 0;
    @observable withdrawTips = true;

    @action.bound
    setFetching(isFetching) {
        this.fetching = isFetching;
    }

    @action.bound
    async recallUser() {
        let json = await storage.getItem(keys.me);
        let resetVersion = await storage.getItem(keys.resetVersion);

        if (json && resetVersion == Config.AppVersionNumber) {
            runInAction(() => {
                // this.me = new user(json.id, json.name, json.avatar, json.token);
                this.me = json;
                this.login = true;
                global.TOKEN = json.token;
            });
        }
    }

    @action.bound
    async remember(json) {
        await storage.setItem(keys.me, json);
        // runInAction(() => {
        //   // this.me = new user(json.id, json.name, json.avatar, json.token);
        //   this.me = json;
        // });
    }

    @action.bound
    async signIn(json) {
        this.me = json;
        this.login = true;
        global.TOKEN = json.token;
        await storage.setItem(keys.me, json);
    }

    @action.bound
    async forget() {
        await storage.removeItem(keys.me);
        await storage.removeItem(keys.viewedVersion);
        await storage.removeItem(keys.commentAppStoreVersion);
        await storage.removeItem(keys.contributeRuleRead);
        runInAction(() => {
            this.me = {};
        });
    }

    @action.bound
    signOut() {
        this.me = {};
        this.login = false;
        global.TOKEN = null;
    }

    @action.bound
    changeUserStatus(status: boolean) {
        this.me.isNewUser = status;
        storage.setItem(keys.me, this.me);
        this.updateUserCache(this.me);
    }

    @action.bound
    changeAvatar(avatarUrl) {
        this.me.avatar = avatarUrl;
    }

    @action.bound
    recordOperation(noTicketTips) {
        this.noTicketTips = noTicketTips;
    }

    // 记住已查看出题规则
    @action.bound
    async updateContributeRuleRead(contributeRuleRead) {
        this.contributeRuleRead = contributeRuleRead;
        await storage.setItem(keys.contributeRuleRead, contributeRuleRead);
    }

    // 记录已查看的版本更新提示
    @action.bound
    async updateViewedVesion(viewedVersion) {
        this.viewedVersion = viewedVersion;
        await storage.setItem(keys.viewedVersion, viewedVersion);
    }

    // echo对象
    @action.bound
    setEcho(echo) {
        this.echo = echo;
    }

    // 用于signToken 每个版本静默重新登录一次，防止storage数据结构改动引起的错误
    @action.bound
    async updateResetVersion(resetVersion) {
        this.resetVersion = resetVersion;
        console.log('updateResetVersion', resetVersion);
        await storage.setItem(keys.resetVersion, resetVersion);
    }

    // 用于提现后的应用商店好评提醒  每个版本只提醒一次
    @action.bound
    async updateCommentAppStoreVersion(version) {
        await storage.setItem(keys.commentAppStoreVersion, version);
    }

    @action.bound
    async updateUserCache(user) {
        this.userCache = user;
        await storage.setItem(keys.userCache, user);
    }

    @action.bound
    async updateCategoryCache(categories) {
        this.categoryCache = categories;
        await storage.setItem(keys.categoryCache, categories);
    }

    @action.bound
    async updateTaskCache(tasks) {
        this.taskCache = tasks;
        await storage.setItem(keys.taskCache, tasks);
    }

    @action.bound
    async recallCache() {
        const resetVersion = await storage.getItem(keys.resetVersion);
        if (resetVersion == Config.AppVersionNumber) {
            this.userCache = await storage.getItem(keys.userCache);
            this.taskCache = await storage.getItem(keys.taskCache);
            this.categoryCache = await storage.getItem(keys.categoryCache);
        }
    }

    @action.bound
    async updateNoticeCount(count) {
        this.unreadNotice = count;
    }

    @action.bound
    updateWithdrawTips(boolean) {
        console.log('boolean', boolean);
        this.withdrawTips = boolean;
    }
}

export default new app();
