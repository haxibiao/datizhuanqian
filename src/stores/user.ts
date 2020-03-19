import { observable, action, runInAction } from 'mobx';
import Storage from './localStorage';

export interface UserScheme {
    id?: string;
    name?: string;
    avatar?: string;
    token?: string;
    count_articles?: number;
    count_followings?: number;
    count_followers?: number;
    introduction?: string;
    phone?: string;
    wallet?: object;
    [key: string]: any;
}

class UserStore {
    @observable
    public launched: boolean = false;

    @observable
    public me: UserScheme = {};

    @observable
    public login: boolean = false;

    @observable
    public firstInstall: boolean = true;

    public constructor() {
        this.recallUser();
    }

    @action.bound
    async recallUser() {
        const json = await Storage.getItem('me');
        const resetVersion = await Storage.getItem('resetVersion');

        if (json && resetVersion == Config.Version) {
            runInAction(() => {
                // this.me = new user(json.id, json.name, json.avatar, json.token);
                this.me = json;
                this.login = true;
                TOKEN = json.token;
            });
        }
        this.launched = true;
    }

    @action.bound
    async signIn(user: UserScheme) {
        Storage.setItem('me', user);
        this.me = user;
        this.login = true;
        TOKEN = user.token;
    }

    @action.bound
    public signOut() {
        this.me = {};
        this.login = false;
        TOKEN = null;
        Storage.removeItem('me');
    }

    @action.bound
    changeUserStatus(status: boolean) {
        this.me.isNewUser = status;
        Storage.setItem('me', this.me);
        this.updateUserCache(this.me);
    }
}

export default new UserStore();
