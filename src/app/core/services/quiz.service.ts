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

@Injectable({
    providedIn: 'root',
})
export default class QuizService extends BaseService {

    constructor() {
        super('quizzes');
    }

    listByCategoryName(name: string) {
        return this.httpClient.get<Quiz[]>(this.getApiEndpoint(`category/${name}`));
    }

    getByQuizIdAndCategory(id: string, category: string) {
        return this.httpClient.get<Quiz>(this.getApiEndpoint(`${id}/category/${category}`));
    }

    listYears() {
        return this.httpClient.get<{ data: { year: number; id: string; }[] }>(this.getApiEndpoint('years'));
    }

    findById(id: string, excludeCategories: string[] = []) {
        const queryParam = excludeCategories?.length ?  `?excludeCategories=[${excludeCategories.map(category => `"${category}"`)}]` : '';
        return this.httpClient.get<Quiz>(this.getApiEndpoint(`${id}${queryParam}`));
    }
}
