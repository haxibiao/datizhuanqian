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

class QuestionStore {
    static instance: QuestionStore | null;
    static cursor: number = 0;
    public answerScope: number = config.disableAd ? 100 : 5;
    public answerCount: number = 0;
    public correctCount: number = 0;
    @observable public question: Question | null = null;
    @observable public questions: Question[] | null = null;
    @observable public submitted: boolean = false;
    @observable public audited: boolean = false;
    @observable public isAudit: boolean = false;
    @observable public selectedAnswers: any[] = [];

    resetCursor() {
        QuestionStore.cursor = 0;
        this.answerCount = 0;
        this.correctCount = 0;
    }

    @action.bound
    public setQuestions(data: Question[]) {
        this.questions = data;
        if (this.question == null) {
            this.nextQuestion();
        }
    }

    @action.bound
    public nextQuestion() {
        if (this.questions) {
            this.question = this.questions[QuestionStore.cursor];
            if (this.question.status == 0) {
                this.submitted = true;
                this.isAudit = true;
            } else {
                this.submitted = false;
                this.isAudit = false;
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
        } else {
            convertData.add(Value);
        }
        this.selectedAnswers = [...convertData];
    }
}

const storeContext = React.createContext(new QuestionStore());

export const useQuestionStore = () => React.useContext(storeContext);
