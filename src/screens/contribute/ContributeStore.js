/*
 * @flow
 * created by wyk made in 2019-06-25 15:32:53
 */
import { View, Image, Keyboard } from 'react-native';
import { observable, action, runInAction, autorun, computed, when } from 'mobx';
import { ProgressOverlay, beginnerGuidance, SetQuestionGuidance } from 'components';
import { Api } from '../../utils';
import { app } from '@src/store';

const ANSWERS = ['A', 'B', 'C', 'D'];

type target = 'explain_' | '';

export default class ContributeStore {
    static instance = null;

    @observable uploading = null;
    @observable description = '';
    @observable category = null;
    @observable picture = null;
    @observable video = null;
    @observable video_id = null;
    @observable video_path = null;
    @observable video_duration = app.me.video_duration || 30;
    @observable explain_text = null;
    @observable explain_picture = null;
    @observable explain_video = null;
    @observable explain_video_id = null;
    @observable explain_video_path = null;
    @observable explain_video_duration = app.me.explanation_video_duration || 90;
    @observable optionValue = null;
    @observable answers = new Set();
    @observable options = new Map();

    constructor() {
        if (!ContributeStore.instance) {
            ContributeStore.instance = this;
        }
        when(
            () => this.options.size,
            () => {
                beginnerGuidance({
                    guidanceKey: 'SubmitQuestion',
                    GuidanceView: SetQuestionGuidance.submitGuidance,
                });
            },
        );
        return ContributeStore.instance;
    }

    removeInstance() {
        ContributeStore.instance = null;
    }

    @action.bound
    inputDescription(description) {
        this.description = description;
    }

    @action.bound
    selectCategory(category) {
        this.category = category;
    }

    @action.bound
    inputOptionValue(optionValue) {
        this.optionValue = optionValue;
    }

    @action.bound
    inputQuestionExplain(explain_text) {
        this.explain_text = explain_text;
    }

    @action.bound
    reduceAnswer(option) {
        if (this.answers.has(option)) {
            this.answers.delete(option);
            this.options.set(option, false);
        } else {
            if (this.options.size === 2 && this.answers.size === 1) {
                Toast.show({
                    content: '两个选项不能全为正确答案',
                });
                return;
            }
            this.answers.add(option);
            this.options.set(option, true);
        }
    }

    @action.bound
    addOption() {
        if (this.optionValue.trim().length > 0 && !this.options.has(this.optionValue)) {
            this.options.set(this.optionValidate(this.optionValue), false);
        }
        this.optionValue = null;
        Keyboard.dismiss();
    }

    @action.bound
    removeOption(option) {
        this.options.delete(option);
        this.answers.has(option) && this.answers.delete(option);
    }

    optionValidate(optionValue) {
        let character = optionValue
            .trim()
            .split('')
            .join('')
            .toLowerCase();
        console.log(character);
        if (/[a-d]/.test(character[0]) && !/[\u4e00-\u9fa5]|[a-z]/.test(character[1])) {
            if (/[《]/.test(character[1])) {
                optionValue = optionValue.substring(1);
            } else {
                optionValue = optionValue.substring(2);
            }
        }
        return optionValue.trim();
    }

    @action.bound
    imagePicke(type: target = '') {
        Api.imagePicker(
            image => {
                image = `data:${image.mime};base64,${image.data}`;
                runInAction(() => {
                    this[type + 'picture'] = image;
                });
            },
            {
                multiple: false,
                includeBase64: true,
            },
        );
    }

    @action.bound
    videoPicke(type: target = '', uploadType: String) {
        Api.videoPicker(
            video => {
                runInAction(() => {
                    this[type + 'video'] = video;
                    this[type + 'video_path'] = video.path;
                    console.log('video_path123', this.video_path);
                });
            },
            {
                onBeforeUpload: metadata => {
                    if (metadata.duration > this[type + 'video_duration']) {
                        this[type + 'video'] = null;
                        this[type + 'video_path'] = null;
                        Toast.show({
                            content: `抱歉，视频时长需在${this[type + 'video_duration']}秒以内`,
                        });
                        throw `视频时长需在${this[type + 'video_duration']}秒以内`;
                    }
                },
                onStarted: uploadId => {
                    ProgressOverlay.show('正在上传视频');
                    this.uploading = true;
                },
                onProcess: progress => {
                    console.log('progress', progress);
                    ProgressOverlay.progress(progress);
                },
                onCancelled: () => {
                    console.log('onCancelled');
                },
                onCompleted: data => {
                    if (this.uploading) {
                        let video = JSON.parse(data.responseBody);
                        console.log('video', video);
                        if (video.id) {
                            ProgressOverlay.hide();
                            Toast.show({
                                content: '视频上传成功',
                            });
                            this.uploading = false;
                            this[type + 'video_id'] = video.id;
                            console.log('video_id', this[type + 'video_id']);
                        } else {
                            this.onUploadError();
                        }
                    }
                },
                onError: () => this.onUploadError(type),
            },
            uploadType,
        );
    }

    @action.bound
    onUploadError(type: target = '') {
        ProgressOverlay.hide();
        Toast.show({
            content: '视频上传失败',
        });
        this.uploading = false;
        this[type + 'video'] = null;
        this[type + 'video_path'] = null;
    }

    @action.bound
    closeMedia(type: target = '') {
        if (this[type + 'video_path']) {
            this[type + 'video'] = null;
            this[type + 'video_id'] = null;
            this[type + 'video_path'] = null;
        } else {
            this[type + 'picture'] = null;
        }
    }

    @computed get variables() {
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
            video_id: this.video_id,
            image: this.picture,
            answers,
        };
    }

    @computed get explanationVariables() {
        if (this.explain_text || this.explain_video_id || this.explain_picture) {
            return {
                content: this.explain_text,
                video_id: this.explain_video_id,
                images: [this.explain_picture],
            };
        }
        return null;
    }

    buildOptions() {
        let answers = [];
        let selections;
        let options;
        // options = this.randomSort([...this.options]);
        selections = [...this.options].map((option, index) => {
            if (option) {
                option[1] && answers.push(ANSWERS[index]);
                return {
                    Value: ANSWERS[index],
                    Text: option[0],
                };
            }
        });
        return {
            selections,
            answers,
        };
    }

    randomSort(array) {
        var m = array.length,
            t,
            i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    validator() {
        var verified = true;
        var tips = {
            description: '请填写题干,不少于8个字',
            selections: '请填写答案选项',
            answers: '请设置正确答案',
            category_id: '请选择题库',
        };

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
