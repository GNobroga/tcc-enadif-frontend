import { Injectable, signal } from "@angular/core";
import BaseService from "./base.service";
import { tap } from "rxjs";


export type Achievement = {
    _id: string;
    header: string;
    detail: string;
    type: string;
    goal: number;
    imageUrl: string;
    createdAt?: Date;
    acquired: boolean;
    acquiredAt?: Date;
}

@Injectable({
    providedIn: 'root',
})
export default class AchievementService extends BaseService {

    achievements = signal<Achievement[]>([]);

    constructor() {
        super('achievements');
    }

    listAll(ownerId: string) {
        return this.httpClient.get<Achievement[]>(this.getApiEndpoint(`user/${ownerId}`))
            .pipe(tap(response => this.achievements.set(response)));
    }

    countAcquired() {
        return this.httpClient.get<{ count: number; }>(this.getApiEndpoint('count'));
    }

    check() {
        return this.httpClient.get<{ hasNew: boolean; }>(this.getApiEndpoint('check/user'));
    }

    findById(achievementId: string) {
        return this.httpClient.get<Achievement>(this.getApiEndpoint(`${achievementId}`));
    }
}