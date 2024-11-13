import { Injectable, signal } from "@angular/core";
import BaseService from "./base.service";
import { Observable, shareReplay, tap } from "rxjs";


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

    private getData<T>(endpoint: string): Observable<T> {
        return this.httpClient.get<T>(this.getApiEndpoint(endpoint)).pipe(
          shareReplay(1) 
        );
      }

    listAll(ownerId: string) {
        return this.getData<Achievement[]>(`user/${ownerId}`).pipe(
            tap(response => this.achievements.set(response)) 
        );
    }

    countAcquired(): Observable<{ count: number }> {
        return this.getData('count');
    }

    check(): Observable<{ hasNew: boolean }> {
        return this.getData('check/user');
    }

    findById(achievementId: string): Observable<Achievement> {
        return this.getData<Achievement>(`${achievementId}`);
    }
}