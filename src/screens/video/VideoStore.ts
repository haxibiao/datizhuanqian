import { observable, action, runInAction } from 'mobx';
import { SCREEN_HEIGHT } from 'utils';

interface User {
    id: number;
    name: string;
    avatar: string;
    followed_user_status: number;
}

interface Question {
    id: number;
    description: string;
    count_likes: number;
    count_comments: number;
    liked: boolean;
    user: User;
}

interface Video {
    id: number;
    width: number;
    height: number;
    url: string;
    cover?: string;
    question: Question;
    is_ad: boolean;
}

interface Visit {
    visited_type: string;
    visited_id: number;
}

class VideoStore {
    readonly rewardLimit: number = 30;

    @observable public dataSource: Video[] = [];
    @observable public isLoading: boolean = true;
    @observable public isError: boolean = false;
    @observable public isFinish: boolean = false;
    @observable public isRefreshing: boolean = false;
    @observable public isLoadMore: boolean = false;
    @observable public videoPaused: boolean = false;
    @observable public viewableItemIndex: number = -1;
    @observable public rewardProgress: number = 0;
    @observable public getReward = [];
    @observable public visits: Visit[] = [];

    @action.bound
    public addSource(source: Video[]) {
        this.dataSource = this.dataSource.concat(source);
    }

    @action.bound
    public addVisit(source: Video) {
        const visit = {
            visited_type: 'posts',
            visited_id: source.id,
        };
        if (!source.is_ad) {
            for (let i = 0, count = this.visits.length; i < count; i++) {
                let visitedType = this.visits[i].visited_type;
                let visitedId = this.visits[i].visited_id;
                if (visit.visited_id === visitedId && visit.visited_type === visitedType) {
                    return;
                }
            }
            this.visits = this.visits.concat(visit);
            console.log('visits', this.visits);
        }
    }

    @action.bound
    public play() {
        this.videoPaused = false;
    }

    @action.bound
    public pause() {
        this.videoPaused = true;
    }

    @action.bound
    public addGetRewardId(id: any) {
        this.getReward = this.getReward.concat(id);
        console.log('this.getReward', this.getReward);
    }
}

export default new VideoStore();
