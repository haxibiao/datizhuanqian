import React from 'react';
export { observer } from 'mobx-react';
import { observable, action, runInAction, autorun, computed, when } from 'mobx';
import { ProgressOverlay, beginnerGuidance, SetQuestionGuidance } from '@src/components';
import { app } from '@src/store';
// import { Api } from '@src/utils';
import { imagePicker, videoPicker } from 'common';

type Value = 'A' | 'B' | 'C' | 'D';

interface Category {
    id: number;
    name: string;
}

interface Video {
    path: string;
    id?: number;
}

interface Audio {
    path: string;
    key?: number;
    id?: number;
}

interface Explain {
    text?: string;
    picture?: string;
    video?: Video | null;
}

class Selection {
    @observable public Value?: Value;
    @observable public Text?: string = '';
    @observable public isCorrect: boolean = false;

    constructor(Value: Value, Text?: string) {
        this.Value = Value;
        this.Text = Text;
    }
}

class QuestionStore {
    static instance: QuestionStore | null;
    public videoDuration: number = app.me.video_duration || 40; //上传时间限制
    public explainDuration: number = app.me.explanation_video_duration || 100; //上传时间限制
    @observable public description: string = '';
    @observable public category: Category = <Category>{};
    @observable public picture: string | null = null; // 图片
    @observable public video: Video | null = null; // 视频对象
    @observable public audio: Audio | null = null; // 音频对象
    @observable public explain: Explain | null = null; // 解析对象
    @observable public selections = values.map(item => new Selection(item));
    // 缓存实例
    constructor() {
        if (QuestionStore.instance) {
            QuestionStore.instance = this;
        }
        return QuestionStore.instance as QuestionStore;
    }
    // 删除实例
    removeInstance() {
        QuestionStore.instance = null;
    }

    @action.bound
    setDescription(description: string) {
        this.description = description;
    }

    @action.bound
    selectCategory(category: Category) {
        this.category = category;
    }

    @action.bound
    setSelectionText(index: number, value: string) {
        this.selections[index].Text = value;
    }

    @action.bound
    setAnswers(index: number) {
        this.selections[index].isCorrect = !this.selections[index].isCorrect;
    }

    @action.bound
    setContentVideo(video: Video | null) {
        this.video = video;
    }

    @action.bound
    setQuestionAudio(audio: Audio | null) {
        this.audio = audio;
    }

    @action.bound
    setContentPicture(picture: string) {
        this.picture = picture;
    }

    @action.bound
    setExplain(explain: Explain | null) {
        this.explain = explain;
    }
    // 选择题干的图片
    @action.bound
    contentImagePicker() {
        imagePicker(
            (image: any) => {
                image = `data:${image.mime};base64,${image.data}`;
                runInAction(() => {
                    this.setContentPicture(image);
                });
            },
            {
                multiple: false,
                includeBase64: true,
            },
        );
    }
    // 选择解析的图片
    @action.bound
    explainImagePicker() {
        imagePicker(
            (image: any) => {
                image = `data:${image.mime};base64,${image.data}`;
                runInAction(() => {
                    this.setExplain({ ...this.explain, picture: image });
                });
            },
            {
                multiple: false,
                includeBase64: true,
            },
        );
    }
    // 选择题干的视频
    @action.bound
    contentVideoPicker() {
        videoPicker(
            (video: any) => {
                runInAction(() => {
                    this.video = { path: video.path };
                });
            },
            {
                uploadType: 'questions',
                onBeforeUpload: (metadata: any) => {
                    if (metadata.duration > this.videoDuration) {
                        this.setContentVideo(null);
                        Toast.show({
                            content: `视频时长不能超过${this.videoDuration}秒`,
                        });
                        throw `视频时长不能超过${this.videoDuration}秒`;
                    }
                },
                onStarted: (uploadId: number) => {
                    ProgressOverlay.show('正在上传视频');
                },
                onProcess: (progress: number) => {
                    ProgressOverlay.progress(progress);
                },
                onCancelled: () => {
                    console.log('onCancelled');
                },
                onCompleted: (data: any) => {
                    let video = JSON.parse(data.responseBody);
                    if (video.id) {
                        ProgressOverlay.hide();
                        Toast.show({
                            content: '视频上传成功',
                        });
                        this.setContentVideo(Object.assign({}, this.video, { id: video.id }));
                    } else {
                        this.setContentVideo(null);
                    }
                },
                onError: () => {
                    this.setContentVideo(null);
                },
            },
        );
    }
    // 选择解析的视频
    @action.bound
    explainVideoPicker() {
        videoPicker(
            (video: any) => {
                runInAction(() => {
                    this.setExplain({ ...this.explain, video: { path: video.path } });
                });
            },
            {
                uploadType: 'questions',
                onBeforeUpload: (metadata: any) => {
                    if (metadata.duration > this.explainDuration) {
                        this.setExplain({ ...this.explain, video: null });
                        Toast.show({
                            content: `视频时长不能超过${this.explainDuration}秒`,
                        });
                        throw `视频时长不能超过${this.explainDuration}秒`;
                    }
                },
                onStarted: (uploadId: number) => {
                    ProgressOverlay.show('正在上传视频');
                },
                onProcess: (progress: number) => {
                    console.log('progress', progress);
                    ProgressOverlay.progress(progress);
                },
                onCancelled: () => {
                    console.log('onCancelled');
                },
                onCompleted: (data: any) => {
                    const video = JSON.parse(data.responseBody);
                    if (video.id) {
                        ProgressOverlay.hide();
                        Toast.show({
                            content: '视频上传成功',
                        });
                        video.path = this.explain?.video?.path;
                        this.setExplain({ ...this.explain, video });
                    } else {
                        this.setExplain({ ...this.explain, video: null });
                    }
                },
                onError: () => {
                    this.setExplain({ ...this.explain, video: null });
                },
            },
        );
    }
    // 获取提交后端的题目参数
    @computed get variables(): any {
        let { selections, answers } = this.buildOptions();
        let description = null;
        if (this.description && this.description.trim().length > 7) {
            description = this.description.trim();
        }
        selections = selections.length > 1 ? selections : null;
        answers = answers.length > 0 ? answers : null;

        return {
            category_id: this.category ? this.category.id : null,
            description,
            selections,
            audio_id: this.audio?.id,
            video_id: this.video?.id,
            image: this.picture,
            answers,
        };
    }
    // 获取提交后端的解析参数
    @computed get explanationVariables() {
        if (this.explain && Object.keys(this.explain).length > 0) {
            return {
                content: this.explain.text,
                video_id: this.explain.video?.id,
                images: [this.explain.picture],
            };
        }
        return null;
    }
    // 构建提交后端的选项和答案参数格式
    buildOptions(): any {
        let selections,
            answers: Value[] = [];
        console.log('====================================');
        console.log('this.selections', this.selections);
        console.log('====================================');
        selections = this.selections.filter((selection, index) => {
            if (selection.Text) {
                selection.isCorrect && answers.push(values[index]);
                return {
                    Value: values[index],
                    Text: selection.Text,
                };
            }
        });
        return {
            selections,
            answers,
        };
    }
    // 参数验证
    validator() {
        var verified = true;
        var tips: any = {
            description: '请填写题干,不少于8个字',
            selections: '请填写答案选项',
            answers: '请设置正确答案',
            category_id: '请选择题库',
        };
        console.log('====================================');
        console.log('this.variables', this.variables);
        console.log('====================================');
        for (var k in tips) {
            if (!this.variables[k]) {
                Toast.show({
                    content: tips[k],
                });
                verified = false;
                break;
            }
        }
        return verified;
    }
}

const storeContext = React.createContext(new QuestionStore());

export const values: Value[] = ['A', 'B', 'C', 'D'];

export const useQuestionStore = () => React.useContext(storeContext);
