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
    displayName?: string;
}

export interface UserDaysSequence {
    _id: string;
    days: boolean[];
    numberOfOffensives: number;
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

    checkDaySequence() {
        return this.httpClient.get(this.getApiEndpoint('check/day-sequence'));
    }

    canAttemptRandomQuestion() {
        return this.httpClient.get<{ canAttempt: boolean; }>(this.getApiEndpoint('can-attempt-random-question'));
    }


    disableRandomQuestionAccess() {
        return this.httpClient.get<{ disabled: boolean }>(this.getApiEndpoint('disable-random-question-access'));
    }

    //stats/:ownerId
    getStatsByOwnerId(ownerId: string) {
        return this.httpClient.get<UserStats>(this.getApiEndpoint(`stats/${ownerId}`));
    }
}