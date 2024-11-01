import { Injectable } from "@angular/core";
import BaseService from "./base.service";

@Injectable({
    providedIn: 'root',
})
export default class UserFriendService extends BaseService {

    constructor() {
        super('user-friend');
    }

    sendRequestFriend(friendId: string) {
        return this.httpClient.get(this.getApiEndpoint(`send-request/${friendId}`));
    }
}