import { observable, action, runInAction } from 'mobx';
import { app } from '@src/store';
import { GQL } from '@src/apollo';

export default class CompetitionStore {
    @observable public roomId: number = 0;
    @observable public matching: boolean = false;
    @observable public matched: boolean = false;
    @observable public error: boolean = false;
    @observable public offline: boolean = false;
    @observable public score: Array<number> = [0, 0];

    @action.bound
    resetStore() {
        this.matching = false;
        this.matched = false;
        this.error = false;
        this.offline = false;
    }

    @action.bound
    createCompetition(user_id) {
        app.client
            .mutate({
                mutation: GQL.createCompetitionMutation,
                variables: {
                    id: user_id,
                },
            })
            .then(result => {
                const competition = result.data.createCompetition;
                this.roomId = competition.id;
                this.listenCompetition(competition.id);
            })
            .catch(err => {
                console.log('err', err);
            });
    }

    @action.bound
    submitTheAnswer(payload) {
        app.client
            .mutate({
                mutation: GQL.sendMessageMutation,
                variables: payload,
            })
            .then(data => {
                console.log('Data', data);
            })
            .catch(err => {
                console.log('err', err);
            });
    }

    @action.bound
    listenCompetition(id) {
        app.echo
            .join(`Competition.${id}`)
            .here(users => {
                console.log('echo join here users:', users);
            })
            .joining(user => {
                console.log(user.name);
            })
            .leaving(user => {
                console.log(user.name);
            })
            .listen('score', score => {});
    }
}
