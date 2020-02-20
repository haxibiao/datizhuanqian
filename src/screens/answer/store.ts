import React from 'react';
export { observer } from 'mobx-react';
import { observable, action, runInAction, autorun, computed, when } from 'mobx';
import { app, config } from '@src/store';

interface Selection {
    Text: string;
    Value: string;
}

interface Question {
    id: number;
    answer: string;
    description: string;
    selections_array: Selection[];
    image?: any;
    video?: any;
    audio?: any;
    status?: number;
    favorite_status?: boolean;
    gold?: number;
    ticket?: number;
    liked?: boolean;
    count_likes?: number;
    count_comments?: number;
    explanation?: any;
}

export class QuestionStore {
    static instance: QuestionStore | null;
    static cursor: number = 0;
    public answerScope: number = config.disableAd ? 100 : 5;
    public answerCount: number = 0;
    public correctCount: number = 0;
    @observable public category = {};
    @observable public question: Question | null = null;
    @observable public questions: Question[] = [];
    @observable public submitted: boolean = false; // 是否已经作答
    @observable public audited: boolean = false; // 是否已经审核
    @observable public isAudit: boolean = false; // 是否为审核题
    @observable public isMultiple: boolean = false; // 是否为多选题
    @observable public selectedAnswers: any[] = []; // 选择的答案

    // constructor() {
    //     if (!QuestionStore.instance) {
    //         QuestionStore.instance = this;
    //     }
    //     return QuestionStore.instance;
    // }

    resetCursor() {
        this.answerCount = 0;
        this.correctCount = 0;
    }

    @action.bound
    public setQuestions(data: Question[]) {
        this.questions = this.questions.concat(data);
        if (!this.question) {
            this.nextQuestion();
        }
    }

    @action.bound
    public nextQuestion() {
        this.selectedAnswers = [];

        if (this.questions) {
            this.question = this.questions[QuestionStore.cursor];

            if (this.question.status == 0) {
                this.submitted = true;
                this.isAudit = true;
                this.isMultiple = String(this.question.answer).length > 1;
            } else {
                this.submitted = false;
                this.isAudit = false;
                this.isMultiple = String(this.question.answer).length > 1;
            }
            QuestionStore.cursor++;
        }
    }

    @action.bound
    public answerQuestion() {
        this.submitted = true;
        this.answerCount++;
        if (this.question?.answer === this.selectedAnswers.sort().join('')) {
            this.correctCount++;
        }
    }

    @action.bound
    public auditQuestion() {
        this.audited = true;
    }

    @action.bound
    public selectAnswer(Value: any) {
        const convertData = new Set(this.selectedAnswers);
        if (convertData.has(Value)) {
            convertData.delete(Value);
        } else if (this.isMultiple) {
            convertData.add(Value);
        } else {
            convertData.clear();
            convertData.add(Value);
        }
        this.selectedAnswers = [...convertData];
    }
}
