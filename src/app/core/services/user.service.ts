import { Injectable } from "@angular/core";
import BaseService from "./base.service";

export interface UserStats {
    _id: string;
    totalAnsweredQuestions: number;
    incorrectAnswersCount: number;
    correctAnswersCount: number;
    score: number;
    averageResponseTime: number;
    countFriends: number;
    correctAnswersByCategory: Record<string, number>;
    trialPeriod: boolean;
    dailyHintCount: number;
}

export interface UserDaysSequence {
    id: string;
    days: boolean[];
    startDate: Date;
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

    getDaysSequence() {
        return this.httpClient.get<UserDaysSequence>(this.getApiEndpoint('days-sequence'));
    }

    deleteUser() {
        return this.httpClient.delete(this.getApiEndpoint());
    }

    decreaseDailyHint() {
        return this.httpClient.get(this.getApiEndpoint('decrease-daily-hint'));
    }
}