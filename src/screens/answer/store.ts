import React from 'react';
export { observer } from 'mobx-react';
import { observable, action, runInAction, autorun, computed, when } from 'mobx';
import { app, config } from '@src/store';

type AnswerResult = 'correct' | 'error' | 'miss';

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
    [P: string]: any;
}

export class QuestionStore {
    @observable public question: Question;
    @observable public order: number = -1; //题目排序
    @observable public answered: boolean = false; // 是否已经作答
    @observable public isAudited: boolean = false; // 是否已经审核
    @observable public isAudit: boolean = false; // 是否为审核题
    @observable public isMultiple: boolean = false; // 是否为多选题
    @observable public isExam: boolean = false; // 是否为考试题
    @observable public selectedAnswers: string = ''; // 选择的答案
    @observable public answerResult: AnswerResult = 'miss'; // 题目状态:错误、正确、未作答

    constructor(question: Question, order?: number) {
        this.question = question;
        this.isAudit = this.question.status == 0;
        this.isMultiple = String(this.question.answer).length > 1;
        if (order !== undefined) {
            this.isExam = true;
            this.order = order;
        }
    }

    // 提交答案
    @action.bound
    public answerQuestion(): AnswerResult {
        this.answered = true;
        this.answerResult = this.selectedAnswers == this.question.answer ? 'correct' : 'error';
        return this.answerResult;
    }

    // 审核题目
    @action.bound
    public auditQuestion() {
        this.isAudited = true;
    }

    // 选择答案
    @action.bound
    public selectAnswer(Value: any) {
        const convertData = new Set(this.selectedAnswers.split(''));
        if (convertData.has(Value)) {
            convertData.delete(Value);
        } else if (this.isMultiple) {
            convertData.add(Value);
        } else {
            convertData.clear();
            convertData.add(Value);
        }
        return (this.selectedAnswers = [...convertData].sort().join(''));
    }
}

export class QuestionsStore {
    public correctCount: number = 0;
    @observable public questions: Question[] = [];
    @observable public transcript: AnswerResult[] = []; //成绩单
    @observable public viewableItemIndex: number = 0;

    @action.bound
    public addQuestions(data: Question[]) {
        this.questions = data;
        this.transcript = Array.from({ length: data.length });
    }

    @action.bound
    public setTranscript(serialNumber: number, result: AnswerResult) {
        this.transcript[serialNumber] = result;
    }
}
