import { observable, action, runInAction } from 'mobx';

class VideoStore {
    @observable dataSource: Array = [];
    @observable isLoading: boolean = true;
    @observable isError: boolean = false;
    @observable isFinish: boolean = false;
    @observable isRefreshing: boolean = false;
    @observable isLoadMore: boolean = false;
    @observable videoPaused: boolean = false;
    @observable intoViewVideoId: number = null;
    @observable currentPage: number = 3;
    @observable lastPage: number = 1;

    @action.bound
    addSource(source) {
        this.currentPage += 1;
        this.dataSource = this.dataSource.concat(source);
    }

    @action.bound
    play() {
        this.videoPaused = false;
    }

    @action.bound
    pause() {
        this.videoPaused = true;
    }
}

export default new VideoStore();
