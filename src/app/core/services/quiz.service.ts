import { Injectable } from "@angular/core";
import BaseService from "./base.service";
import { Question } from "src/app/feature/quiz/components/quiz-question/quiz-question.component";

export interface Quiz {
    _id: string;
    year: number;
    questions: Question[];
    timeSpent: [number, number, number];
    completed: boolean;
}

export interface QuizHistory {
    year: number;
    quizId: string;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    startTime: [number, number, number];
    timeSpent: [number, number, number];
    score: number;
}


@Injectable({
    providedIn: 'root',
})
export default class QuizService extends BaseService {

    constructor() {
        super('quizzes');
    }

    finishQuiz({ quizId, correctQuestionIds, timeSpent, category, excludeCategories, randomize }: { randomize: boolean; excludeCategories: string[]; category: string; quizId: string; correctQuestionIds: string[]; timeSpent: number[]; }) {
        return this.httpClient.post<{ created: boolean; score: number; }>(this.getApiEndpoint(`finish/${quizId}`), {
            correctQuestionIds,
            timeSpent,
            category,
            excludeCategories,
            randomize
        });
    }

    listByCategoryName(name: string) {
        return this.httpClient.get<Quiz[]>(this.getApiEndpoint(`category/${name}`));
    }

    getByQuizIdAndCategory(id: string, category: string, limit: number | null = null) {
        const additionalParameters = limit ? `?limit=${limit}` : '';
        return this.httpClient.get<Quiz>(this.getApiEndpoint(`${id}/category/${category}${additionalParameters}`));
    }

    listYears() {
        return this.httpClient.get<{ data: { year: number; id: string; }[] }>(this.getApiEndpoint('years'));
    }

    findById(id: string, excludeCategories: string[] = []) {
        const queryParam = excludeCategories?.length ?  `?excludeCategories=[${excludeCategories.map(category => `"${category}"`)}]` : '';
        return this.httpClient.get<Quiz>(this.getApiEndpoint(`${id}${queryParam}`));
    }

    listHistory() {
        return this.httpClient.get<QuizHistory[]>(this.getApiEndpoint('user/history'));
    }

    hasQuestions(quizId: string) {
        return this.httpClient.get<string[]>(this.getApiEndpoint(`has-questions/${quizId}`));
    }

    getCategoryQuizProgress(category: string) {
        return this.httpClient.get<{ totalQuizzes: number; completedQuizzes: number; }>(this.getApiEndpoint(`category-progress/${category}`));
    }
}
