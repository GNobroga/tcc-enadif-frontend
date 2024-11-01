import { Injectable } from "@angular/core";
import BaseService from "./base.service";

@Injectable({
    providedIn: 'root',
})
export default class UserFriendService extends BaseService {

    constructor() {
        super('user-friend');
    }

    removeFriend(friendId: string) {
        return this.httpClient.get(this.getApiEndpoint(`remove-friend/${friendId}`));
    }

    sendRequestFriend(friendId: string) {
        return this.httpClient.get(this.getApiEndpoint(`send-request/${friendId}`));
    }

    acceptRequest(friendRequestId: string) {
        return this.httpClient.get(this.getApiEndpoint(`accept-request/${friendRequestId}`));
    }

    rejectRequest(friendRequestId: string) {
        return this.httpClient.get(this.getApiEndpoint(`reject-request/${friendRequestId}`));
    }
}