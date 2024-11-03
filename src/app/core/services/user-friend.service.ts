import { Injectable } from "@angular/core";
import BaseService from "./base.service";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export default class UserFriendService extends BaseService {

    constructor() {
        super('user-friend');
    }


    async checkIfTheyFriends(friendId: string) {
        return await lastValueFrom(this.httpClient.get<{ friend: boolean }>(this.getApiEndpoint(`check-if-they-friends/${friendId}`)));
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