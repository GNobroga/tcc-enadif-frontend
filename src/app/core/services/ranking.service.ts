import { Injectable } from "@angular/core";
import BaseService from "./base.service";

export interface UserRanking {
    userId: string;
    name: string;
    photoUrl: string;
    score: number;
}

@Injectable({
    providedIn: 'root',
})
export default class RankingService extends BaseService {

    constructor() {
        super('ranking');
    }

    listAll() {
        return this.httpClient.get<UserRanking[]>(this.getApiEndpoint());
    }
}