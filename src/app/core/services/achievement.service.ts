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
    id: string;
    header: string;
    detail: string;
    type: 'ranking' | 'social' | 'learning';
    goal: {
        description: string;
        count: number;
    },
    imageUrl: string;
    createdAt: Date;
    acquired: boolean;
}

@Injectable({
    providedIn: 'root',
})
export default class AchievementService extends BaseService {

    achievements = signal<Achievement[]>([]);

    constructor() {
        super('achievements');
    }

    listAll() {
        return this.httpClient.get<Achievement[]>(this.getApiEndpoint())
            .pipe(tap(response => this.achievements.set(response)));
    }

    countAcquired() {
        return this.httpClient.get<{ count: number; }>(this.getApiEndpoint('count'));
    }
}