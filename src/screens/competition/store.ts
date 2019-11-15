import { observable, action, runInAction } from 'mobx';
import { exceptionCapture, syncGetter } from '@src/common';
import { app } from '@src/store';
import { GQL } from '@src/apollo';

export default class CompetitionStore {
    @observable public game: Record<string, any> = {};
    @observable public matching: boolean = false;
    @observable public finished: boolean = false;
    @observable public error: boolean = false;
    @observable public offline: boolean = false;
    @observable public score: number[] = [0, 0];
    @observable public rival: Record<string, any> = {};

    @action.bound
    public resetStore() {
        this.matching = false;
        this.error = false;
        this.offline = false;
    }

    @action.bound
    public async matchGame() {
        console.log('====================================');
        console.log('matchGame');
        console.log('====================================');
        this.matching = true;
        const [error, result] = await exceptionCapture(() => {
            return app.client.mutate({
                mutation: GQL.MatchGameMutation,
            });
        });
        const matchGame = syncGetter('data.matchGame', result);
        console.log('====================================');
        console.log('matchGame', matchGame, error);
        console.log('====================================');
        if (error) {
            Toast.show({ content: '匹配失败', layout: 'top' });
            this.matching = false;
        } else if (matchGame) {
            this.game = matchGame.game;
            this.rival = matchGame.user;
            this.matching = false;
            this.playGame();
        } else {
            app.echo.private('App.User.' + app.me.id).listen('NewGame', (newGame: object) => {
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
            Toast.show({ content: '取消失败', layout: 'top' });
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

    // 计算自己得分，广播事件
    @action.bound
    public async calculateScore(score: number) {
        this.score[0] += score;
        console.log('score', score);
        const [error, result] = await exceptionCapture(() => {
            return app.client.mutate({
                mutation: GQL.ReceiveGameScore,
                variables: { game_id: this.game.id, score: score },
            });
        });

        console.log('ReceiveGameScore', result, error);

        // Toast.show({
        //     content: error,
        // });

        // app.echo
    }

    @action.bound
    public playGame() {
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
                this.leaveGameMutate(user.id, app.me.id, this.game.id);
            })
            .listen('Score', data => {
                console.log('game_score', data.score);
                this.score[1] += data.score;
            });
    }

    @action.bound
    public gameOver() {}
}
