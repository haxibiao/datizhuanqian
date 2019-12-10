import { observable, action, runInAction } from 'mobx';
import { SCREEN_WIDTH } from 'utils';

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
}

class VideoStore {
    @observable public dataSource: Video[] = [];
    @observable public questionsId = [];
    @observable public viewableItemIndex: number = -1;
    @observable public containerWidth: number = SCREEN_WIDTH;
    @action.bound
    public addSource(source: Video[]) {
        this.dataSource = this.dataSource.concat(source);
    }

    @action.bound
    public addQusetionId(id: any) {
        this.questionsId = this.questionsId.concat(id);
        console.log('this.getReward', this.questionsId);
    }
}

export default new VideoStore();
