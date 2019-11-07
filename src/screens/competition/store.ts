import { observable, action, runInAction } from 'mobx';
import { exceptionCapture, syncGetter } from '@src/common';
import { app } from '@src/store';
import { GQL } from '@src/apollo';

export default class CompetitionStore {
    @observable public game: Record<string, any> = {};
    @observable public matching: boolean = false;
    @observable public matched: boolean = false;
    @observable public finished: boolean = false;
    @observable public error: boolean = false;
    @observable public offline: boolean = false;
    @observable public score: number[] = [0, 0];
    @observable public rival: Record<string, any> = {};

    @action.bound
    public resetStore() {
        this.matching = false;
        this.matched = false;
        this.error = false;
        this.offline = false;
    }

    @action.bound
    public async matchGame() {
        this.matching = true;
        app.echo.private('App.User.' + app.me.id).listen('NewGame', (game: object) => {
            this.game = game;
            this.playGame();
        });

        const [error, result] = await exceptionCapture(
            app.client.mutate({
                mutation: GQL.MatchGameMutation,
            }),
        );
        const matchGame = syncGetter('data.matchGame', result);
        if (matchGame) {
            this.game = matchGame.game;
            this.rival = matchGame.user;
            this.playGame();
        } else if (error) {
            this.matching = false;
        }
    }

    @action.bound
    public cancelMatch() {
        this.matching = false;
    }

    @action.bound
    public async leaveGame() {
        const [error, result] = await exceptionCapture(
            app.client.mutate({
                mutation: GQL.LeaveGameMutation,
            }),
        );
        const leaveGame = syncGetter('data.leaveGame', result);
        if (leaveGame) {
            this.gameOver();
        }
    }

    // 计算自己得分，广播事件
    @action.bound
    public calculateScore(score: number) {
        this.score[0] += score;
        // app.echo
    }

    @action.bound
    public playGame() {
        app.echo
            .join(`game.${this.game.id}`)
            .here(users => {
                console.log('echo join here users:', users);
            })
            .joining(user => {
                console.log(user.name);
                this.rival = user;
            })
            .leaving(user => {
                console.log(user.name);
            })
            .listen('score', score => {
                this.score[1] += score;
            });
    }

    @action.bound
    public gameOver() {
        app.echo.leave(`game.${this.game.id}`);
    }
}
