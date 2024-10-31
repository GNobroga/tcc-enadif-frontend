import { Injectable, signal } from "@angular/core";
import BaseService from "./base.service";
import { switchMap, tap } from "rxjs";
import { User } from "@angular/fire/auth";
import { ChatMessage } from "src/app/feature/tab/pages/chat-page/chat-page.component";

export type Message = {
    senderId: string;
    text: string;
    sentAt: Date;
}

export type ChatPrivate = {
    roomId: string;
    participantTwo: User;
    messages: Message[];
}


@Injectable({
    providedIn: 'root',
})
export default class ChatManagerService extends BaseService {

    constructor() {
        super('chat-manager');
    }

    privateChats = signal([] as ChatPrivate[]);

    createPrivateChat(participantTwoId: string) {
        return this.httpClient.post<{ roomId: string }>(this.getApiEndpoint('create-private'), { participantTwoId });
    }

    listPrivateChat() {
        return this.httpClient.get<ChatPrivate[]>(this.getApiEndpoint('list-private'))
            .pipe(tap(chats => this.privateChats.set(chats)));
    }

    listMessagesFromChat(roomId: string) {
        return this.httpClient.get<ChatMessage[]>(this.getApiEndpoint(`messages-from-private/${roomId}`));
    }
}