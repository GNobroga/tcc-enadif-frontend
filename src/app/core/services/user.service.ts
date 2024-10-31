import { Injectable } from "@angular/core";
import BaseService from "./base.service";

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
}