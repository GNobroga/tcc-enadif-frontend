import { Injectable } from "@angular/core";
import BaseService from "./base.service";

export interface UserStats {
    id: string;
    totalAnsweredQuestions: number;
    incorrectAnswersCount: number;
    correctAnswersCount: number;
    currentUserRanking: number;
    averageResponseTime: number;
    countFriends: number;
    correctAnswersByCategory: Record<string, number>;
}


@Injectable({
    providedIn: 'root',
})
export default class UserService extends BaseService {

    constructor() {
        super('users');
    }

    initializeProgress() {
        return this.httpClient.get(this.getApiEndpoint('initialize-progress'))
            .subscribe();
    }

    getStats() {
        return this.httpClient.get<UserStats>(this.getApiEndpoint('stats'));
    }
}