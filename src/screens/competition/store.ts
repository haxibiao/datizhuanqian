import { observable, action, runInAction } from 'mobx';
import { exceptionCapture, syncGetter } from '@src/common';
import { app } from '@src/store';
import { GQL } from '@src/apollo';

type UserType = 'ME' | 'RIVAL';

export default class CompetitionStore {
    public scoreMultiple: number = 10;
    public matched: boolean = false;
    @observable public game: Record<string, any> = {};
    @observable public matching: boolean = false;
    @observable public error: boolean = false;
    @observable public offline: boolean = false;
    @observable public score: number[] = [0, 0];
    @observable public rival: Record<string, any> = {};
    @observable public answerPassCount: number = 0;

    @action.bound
    public resetStore() {
        this.matching = false;
        this.error = false;
        this.offline = false;
    }

    @action.bound
    public async matchGame() {
        this.matching = true;
        const [error, result] = await exceptionCapture(() => {
            return app.client.mutate({
                mutation: GQL.MatchGameMutation,
            });
        });
        const matchGame = syncGetter('data.matchGame', result);
        console.log('====================================');
        console.log('matchGame', result, matchGame, error);
        console.log('====================================');
        if (error) {
            Toast.show({
                content: error.message || '匹配失败',
                duration: 3000,
                layout: 'top',
            });
            this.matching = false;
        } else if (matchGame) {
            this.game = matchGame.game;
            this.rival = matchGame.user;
            this.matching = false;
            this.playGame();
        } else {
            setTimeout(() => {
                if (!this.matched) {
                    this.matched = true;
                    this.matchRobot();
                }
            }, 5000);
            app.echo.private('App.User.' + app.me.id).listen('NewGame', (newGame: object) => {
                if (this.matched) {
                    return;
                }
                this.matched = true;
                console.log('====================================');
                console.log('NewGame', newGame);
                console.log('====================================');
                this.game = newGame.game;
                this.rival = newGame.game.rival;
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
        const [error, result] = await exceptionCapture(() => {
            return app.client.mutate({
                mutation: GQL.MatchRobotMutation,
            });
        });
        const matchRobot = syncGetter('data.matchRobot', result);
        console.log('====================================');
        console.log('matchRobot', result, matchRobot, error);
        console.log('====================================');
        if (error) {
            Toast.show({
                content: error.message || '匹配失败',
                duration: 3000,
                layout: 'top',
            });
            this.matching = false;
        } else if (matchRobot) {
            this.game = matchRobot;
            this.rival = matchRobot.rival;
            this.matching = false;
        }
    }

    @action.bound
    public async cancelMatch() {
        const [error, result] = await exceptionCapture(() => {
            return app.client.mutate({
                mutation: GQL.OfflineGameMutation,
            });
        });
        const offlineGame = syncGetter('data.offlineGame', result);
        if (offlineGame) {
            this.game = {};
            this.rival = {};
            this.matching = false;
        } else if (error) {
            Toast.show({ content: error.message || '取消失败', layout: 'top' });
        }
    }

    private async leaveGameMutate(user_id: number, game_id: number) {
        const [error, result] = await exceptionCapture(() => {
            return app.client.mutate({
                mutation: GQL.LeaveGameMutation,
                variables: { user_id, game_id },
            });
        });

        console.log('====================================');
        console.log('leaveGameMutate', error, result);
        console.log('====================================');
    }

    @action.bound
    public leaveGame() {
        if (this.game.id) {
            app.echo.leave(`game.${this.game.id}`);
            this.leaveGameMutate(app.me.id, this.game.id);
        }
    }

    // 计算得分，广播事件
    @action.bound
    public async calculateScore(score: number, type: UserType = 'ME') {
        const variables: { game_id: number; score: number; user_id?: number } = {
            game_id: this.game.id,
            score: this.score[0],
        };
        if (type === 'ME') {
            this.score[0] += score;
            this.answerPassCount += 1;
        } else {
            this.score[1] += score;
            variables.user_id = this.rival.id;
        }
        const [error, result] = await exceptionCapture(() => {
            return app.client.mutate({
                mutation: GQL.ReceiveGameScore,
                variables,
            });
        });

        console.log('ReceiveGameScore', result, error, this.answerPassCount);
    }

    @action.bound
    public playGame() {
        console.log('playGame');
        app.echo
            .join(`game.${this.game.id}`)
            // .here(users => {
            //     console.log('here:', users);
            // })
            .joining(user => {
                console.log('joining:', user);
                this.rival = user;
            })
            .leaving(user => {
                console.log('leaving:', user);
                this.leaveGameMutate(user.id, this.game.id);
            })
            .listen('Score', data => {
                console.log('game_score', data);
                if (data.scoreData.socres.user_id !== app.me.id) {
                    this.score[1] = data.scoreData.socres.score;
                }
            });
    }

    @action.bound
    public async gameOver() {
        return await exceptionCapture(() => {
            return app.client.mutate({
                mutation: GQL.EndGameMutation,
                variables: { game_id: this.game.id },
            });
        });
    }
}
