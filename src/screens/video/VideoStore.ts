import { observable, action, runInAction } from 'mobx';
import { SCREEN_HEIGHT } from 'utils';

interface User {
    id: number;
    name: string;
    avatar: string;
    followed_user_status: number;
}

interface Video {
    id: number;
    width: number;
    height: number;
    url: string;
    cover?: string;
}

interface Post {
    id: number;
    description: string;
    count_likes: number;
    count_comments: number;
    liked: boolean;
    user: User;
    video: Video;
    is_ad: boolean;
}

interface Visit {
    visited_type: string;
    visited_id: number;
}

class VideoStore {
    readonly rewardLimit: number = 30;
    @observable public dataSource: Post[] = [];
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
    @observable public guidanceVideo = {};

    @action.bound
    public reset() {
        this.dataSource = [];
        this.isLoading = true;
        this.isError = false;
        this.isFinish = false;
        this.isRefreshing = false;
        this.isLoadMore = false;
        this.videoPaused = false;
        this.viewableItemIndex = -1;
        this.rewardProgress = 0;
        this.getReward = [];
        this.visits = [];
        this.guidanceVideo = {};
    }

    @action.bound
    public addSource(source: Post[]) {
        this.dataSource = this.dataSource.concat(source);
    }

    @action.bound
    public addVisit(source: Post) {
        const visit = {
            visited_type: 'posts',
            visited_id: source && source.id,
        };
        if (source && !source.is_ad) {
            for (let i = 0, count = this.visits.length; i < count; i++) {
                let visitedType = this.visits[i].visited_type;
                let visitedId = this.visits[i].visited_id;
                if (visit.visited_id === visitedId && visit.visited_type === visitedType) {
                    return;
                }
            }
            this.visits = this.visits.concat(visit);
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
    }

    @action.bound
    public filterUserPost(id: any) {
        const filterPost = this.dataSource.filter((elem, i) => {
            return elem.user.id !== id;
        });
        this.dataSource = filterPost;
    }

    @action.bound
    public setGuidanceVideo(post: object) {
        this.guidanceVideo = post;
    }
}

export default new VideoStore();
