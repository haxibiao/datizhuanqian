import { observable, action, runInAction } from 'mobx';
import user from './user';
import { keys, storage } from './storage';
import { Config, SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils';
import exceptionCapture from '../common/helper/exceptionCapture';
import { syncGetter } from '../common/helper/adapter';
import { GQL } from '../service/graphql';

class app {
    @observable me = {};
    @observable login = false;
    @observable fetching = false;
    @observable contributeRuleRead = false;
    @observable firstReadSpiderVideoTask = false;
    @observable firstOpenVideoOperation = false;
    @observable competitionGuide = false;
    @observable echo = null;
    @observable resetVersion = 1;
    @observable userCache = null;
    @observable taskCache = null;
    @observable tagsCache = null;
    @observable tagListData = {};
    @observable withdrawCache = null;
    @observable noTicketTips = true;
    @observable unreadNotice = 0;
    @observable withdrawTips = false;
    @observable launched: boolean = false;
    @observable modalIsShow: boolean = false;
    @observable gameConfig: object = {
        status: 0,
        ticket_loss: 3,
        gold_loss: 50,
        match_time_ms: 7000,
    };
    @observable viewportHeight: number = SCREEN_HEIGHT;
    @observable viewportWidth: number = SCREEN_WIDTH;
    @observable client = {};
    @observable createUserAgreement: boolean = true; // 用户协议观看记录,默认已看

    @action.bound
    setFetching(isFetching) {
        this.fetching = isFetching;
    }

    @action.bound
    async recallUser() {
        const json = await storage.getItem(keys.me);
        const resetVersion = await storage.getItem(keys.resetVersion);

        if (json && resetVersion == Config.Version) {
            runInAction(() => {
                // this.me = new user(json.id, json.name, json.avatar, json.token);
                this.me = json;
                this.login = true;
                global.TOKEN = json.token;
            });
        }
        this.launched = true;
    }

    @action.bound
    async remember(json) {
        await storage.setItem(keys.me, json);
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

    // 记录已查看的版本更新提示
    @action.bound
    async setReadSpiderVideoTask(firstReadSpiderVideoTask) {
        this.firstReadSpiderVideoTask = firstReadSpiderVideoTask;
        await storage.setItem(keys.firstReadSpiderVideoTask, firstReadSpiderVideoTask);
    }

    // 视频操作提示
    @action.bound
    async setOpenVideoOperation(firstOpenVideoOperation) {
        this.firstOpenVideoOperation = firstOpenVideoOperation;
        await storage.setItem(keys.firstOpenVideoOperation, firstOpenVideoOperation);
    }

    // 贡献值玩法提示
    @action.bound
    async setOpenContributeVideo(firstOpenContributeVideo) {
        this.firstOpenContributeVideo = firstOpenContributeVideo;
        await storage.setItem(keys.firstOpenContributeVideo, firstOpenContributeVideo);
    }

    // 答题PK提示
    @action.bound
    async recordCompetitionGuide(isShow) {
        this.competitionGuide = isShow;
        await storage.setItem(keys.competitionGuide, isShow);
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
    async updateTagsCache(tags) {
        this.tagsCache = tags;
        await storage.setItem(keys.tagsCache, tags);
    }

    @action.bound
    async updateTagListCache(id, tag) {
        this.tagListData[id] = tag;
        // console.log('====================================');
        // console.log('this.tagListData', id, this.tagListData[id]);
        // console.log('====================================');
        await storage.setItem(keys.tagListCache + '.' + id, tag);
    }

    @action.bound
    async updateTaskCache(tasks) {
        this.taskCache = tasks;
        await storage.setItem(keys.taskCache, tasks);
    }

    @action.bound
    async updateWithdrawCache(withdraw) {
        this.withdrawCache = withdraw;
        await storage.setItem(keys.withdrawCache, withdraw);
    }

    @action.bound
    async recallCache() {
        const resetVersion = await storage.getItem(keys.resetVersion);
        this.withdrawTips = await storage.getItem(keys.withdrawTips);
        this.firstReadSpiderVideoTask = await storage.getItem(keys.firstReadSpiderVideoTask);
        this.firstOpenVideoOperation = await storage.getItem(keys.firstOpenVideoOperation);
        this.firstOpenContributeVideo = await storage.getItem(keys.firstOpenContributeVideo);
        this.competitionGuide = await storage.getItem(keys.competitionGuide);

        if (resetVersion === Config.Version) {
            this.userCache = await storage.getItem(keys.userCache);
            this.taskCache = await storage.getItem(keys.taskCache);
            this.tagsCache = await storage.getItem(keys.tagsCache);
            this.withdrawCache = await storage.getItem(keys.withdrawCache);
            if (Array.isArray(this.tagsCache)) {
                this.tagsCache.forEach(async tag => {
                    this.tagListData[tag.id] = await storage.getItem(keys.tagListCache + '.' + tag.id);
                });
            }
        }
    }

    @action.bound
    async updateNoticeCount(count) {
        this.unreadNotice = count;
    }

    @action.bound
    async updateWithdrawTips(boolean) {
        this.withdrawTips = boolean;
        await storage.setItem(keys.withdrawTips, boolean);
    }

    @action.bound
    async systemConfig() {
        const [err, res] = await exceptionCapture(() => {
            return this.client.query({
                query: GQL.systemConfigQuery,
            });
        });

        const gameConfig = syncGetter('data.systemConfig.modules.game', res);
        // console.log('====================================');
        // console.log('gameConfig', gameConfig);
        // console.log('====================================');
        if (gameConfig) {
            this.gameConfig = gameConfig;
        }
    }

    @action.bound
    async recall() {
        this.createUserAgreement = await Storage.getItem('createUserAgreement') || false;
        console.log('是否阅读用户：', this.createUserAgreement);

    }
    
}

export default new app();
