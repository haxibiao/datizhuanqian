import { observable, action, runInAction } from 'mobx';
import { app } from '@src/store';
import { GQL } from '@src/apollo';

type UserType = 'ME' | 'RIVAL';

interface User {
    id: number;
    name: string;
    gender?: number;
    avatar_url: string;
}

interface Game {
    id: number;
    end_at: string;
    end_at_unix: number;
    reward: number;
    rival: User;
    user: User;
}

interface GameRoom {
    id: number;
    game: Game;
}

export default class CompetitionStore {
    public scoreMultiple: number = 1; //得分倍数
    public robotOdds: number = 0.3; //机器人答题正确率
    public matched: boolean = false;
    public isRobot: boolean = false;
    public isLeaving: boolean = false;
    public timer: any; //匹配计时器
    public answerPassCount: number = 0; //统计答对数
    @observable public game: Game = <Game>{};
    @observable public matching: boolean = false;
    @observable public error: boolean = false;
    @observable public score: number[] = [0, 0];
    @observable public rival: User = <User>{};
    @observable public me: User = <User>{};

    constructor() {
        const me = { ...app.me };
        me.avatar_url = me.avatar;
        this.me = me;
    }

    @action.bound
    public resetStore() {
        this.matching = false;
        this.error = false;
    }

    @action.bound
    public async matchGame() {
        this.matching = true;
        const [error, result] = await Helper.exceptionCapture(() => {
            return app.mutationClient.mutate({
                mutation: GQL.MatchGameMutation,
            });
        });
        const room = Helper.syncGetter('data.matchGame', result);
        console.log('====================================');
        console.log('room', result, room, error);
        console.log('====================================');
        if (error) {
            Toast.show({
                content: error.message || '匹配失败',
                duration: 3000,
                layout: 'top',
            });
            this.matching = false;
        } else {
            // 超时就匹配机器人
            this.timer = setTimeout(() => {
                console.log('====================================');
                console.log('setTimeout', this.matched);
                console.log('====================================');
                if (!this.matched) {
                    this.matched = true;
                    this.matchRobot();
                }
            }, app.gameConfig.match_time_ms);
            app.echo.private('App.User.' + app.me.id).listen('NewGame', (room: GameRoom) => {
                if (this.matched) {
                    return;
                }
                // 游戏通知超时 阻止逻辑
                if (Math.ceil(new Date().getTime() / 1000) > room.game.end_at_unix) {
                    this.matching = false;
                    return;
                }
                this.matched = true;
                console.log('====================================');
                console.log('NewGame', room);
                console.log('====================================');
                this.isRobot = false;
                this.game = room.game;
                if (room.game.user.id == app.me.id) {
                    this.rival = room.game.rival;
                } else {
                    this.rival = room.game.user;
                }
                this.matching = false;
                this.playGame();
            });
        }
    }

    @action.bound
    public async matchRobot() {
        console.log('====================================');
        console.log('matchRobot');
        console.log('====================================');
        this.matching = true;
        const [error, result] = await Helper.exceptionCapture(() => {
            return app.mutationClient.mutate({
                mutation: GQL.MatchRobotMutation,
            });
        });
        const room = Helper.syncGetter('data.matchRobot', result);
        console.log('====================================');
        console.log('room', result, room, error);
        console.log('====================================');
        if (error) {
            Toast.show({
                content: error.message || '匹配失败',
                duration: 3000,
                layout: 'top',
            });
            this.matching = false;
        } else if (room) {
            this.isRobot = true;
            this.game = room;
            this.rival = room.rival;
            this.robotOdds = room.robot_odds;
            this.matching = false;
        }
    }

    // 取消匹配
    @action.bound
    public async cancelMatch() {
        // 清除机器匹配计时器
        if (this.timer) {
            clearTimeout(this.timer);
        }
        // 如果已经匹配成功了，阻止取消
        if (this.rival.id) {
            return;
        }
        const [error, result] = await Helper.exceptionCapture(() => {
            return app.mutationClient.mutate({
                mutation: GQL.OfflineGameMutation,
            });
        });
        const offlineGame = Helper.syncGetter('data.offlineGame', result);
        if (offlineGame) {
            this.game = <Game>{};
            this.rival = <User>{};
            this.matching = false;
        } else if (error) {
            Toast.show({ content: error.message || '取消失败', layout: 'top' });
        }
    }

    // 离开游戏
    private async leaveGameMutate(user_id: number, game_id: number) {
        const [error, result] = await Helper.exceptionCapture(() => {
            return app.mutationClient.mutate({
                mutation: GQL.LeaveGameMutation,
                variables: { user_id, game_id },
            });
        });

        console.log('====================================');
        console.log('leaveGameMutate', error, result);
        console.log('====================================');
    }

    // 离开房间
    @action.bound
    public leaveGame() {
        if (this.game.id) {
            app.echo.leave(`game.${this.game.id}`);
            this.leaveGameMutate(app.me.id, this.game.id);
        }
    }

    // 计算得分，广播事件
    @action.bound
    public async calculateScore(score: number = 0, type: UserType = 'ME') {
        const variables: { game_id: number; score?: number; user_id?: number } = { game_id: this.game.id };
        if (type === 'ME') {
            this.score[0] += score;
            score > 0 && this.answerPassCount++;
            variables.user_id = this.me.id;
            variables.score = this.score[0];
        } else {
            this.score[1] += score;
            variables.user_id = this.rival.id;
            variables.score = this.score[1];
        }
        const [error, result] = await Helper.exceptionCapture(() => {
            return app.mutationClient.mutate({
                mutation: GQL.ReceiveGameScore,
                variables,
            });
        });
        console.log('ReceiveGameScore', result, error, this.answerPassCount);
    }

    // 游戏事件监听
    @action.bound
    public playGame() {
        console.log('playGame');
        app.echo
            .join(`game.${this.game.id}`)
            // .here(users => {
            //     console.log('here:', users);
            // })
            .joining((user: User) => {
                console.log('joining:', user);
                this.rival = user;
            })
            .leaving((user: User) => {
                console.log('leaving:', user);
                this.isLeaving = true;
                this.leaveGameMutate(user.id, this.game.id);
            })
            .listen('Score', (data: any) => {
                console.log('game_score', data);
                const score = Helper.syncGetter('scoreData.socres.score', data);
                const notMe = Helper.syncGetter('scoreData.socres.user_id', data) !== app.me.id;
                if (notMe && this.score[1] < score) {
                    this.score[1] = score;
                }
            });
    }

    // 结束游戏
    @action.bound
    public async gameOver() {
        return await Helper.exceptionCapture(() => {
            // Toast.show({ content: 'gameOver:' + this.game.id });
            return app.mutationClient.mutate({
                mutation: GQL.EndGameMutation,
                variables: { game_id: this.game.id },
            });
        });
    }

    // 查询游戏状态
    @action.bound
    public async gameQuery() {
        return await Helper.exceptionCapture(() => {
            // Toast.show({ content: 'gameQuery:' + this.game.id });
            return app.client.query({
                query: GQL.GameQuery,
                variables: { game_id: this.game.id },
            });
        });
    }

    // 游戏奖励
    @action.bound
    public async receiveGameReward() {
        return await Helper.exceptionCapture(() => {
            return app.mutationClient.mutate({
                mutation: GQL.GameRewardMutation,
                variables: { game_id: this.game.id, user_id: this.me.id },
            });
        });
    }
}
