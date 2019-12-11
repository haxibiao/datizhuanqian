import { observable, action, runInAction } from 'mobx';
import { SCREEN_WIDTH } from 'utils';
import { keys, storage } from 'store';

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

interface Question {
    id: never;
    description: string;
    count_likes: number;
    count_comments: number;
    liked: boolean;
    selections_array: Array<object>;
    answer: string;
    category: object;
    user: User;
    video: Video;
}

class QuestionStore {
    @observable public dataSource: Question[] = [];
    @observable public isLoading: boolean = true;
    @observable public isError: boolean = false;
    @observable public isFinish: boolean = false;
    @observable public isRefreshing: boolean = false;
    @observable public isLoadMore: boolean = false;
    @observable public answeredId = [];
    @observable public viewableItemIndex: number = -1;
    @observable public containerWidth: number = SCREEN_WIDTH;
    @action.bound
    public addSource(source: Question[]) {
        this.dataSource = this.dataSource.concat(source);
        console.log('this.dataSource', this.dataSource);
    }

    @action.bound
    async addQusetionId(question: any) {
        this.answeredId = this.answeredId.concat(question.id);
        console.log('answeredId', this.answeredId);
        await storage.setItem(keys.answeredId, this.answeredId);
    }

    @action.bound
    async recallCache() {
        this.answeredId = await storage.getItem(keys.answeredId);
        console.log('this.answeredId', this.answeredId);
    }
}

export default new QuestionStore();
