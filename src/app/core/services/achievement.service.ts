import { Injectable, signal } from "@angular/core";
import BaseService from "./base.service";
import { tap } from "rxjs";

// [
//     {
//         "id": "672527bdc531a5acbd801a28",
//         "header": "Master Coder",
//         "detail": "Awarded for completing 100 coding challenges.",
//         "type": "ranking",
//         "goal": {
//             "description": "Complete 100 coding challenges",
//             "count": 100
//         },
//         "imageUrl": "https://example.com/images/achievement.png",
//         "createdAt": "2024-11-01T19:10:53.474Z",
//         "acquired": false
//     },

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