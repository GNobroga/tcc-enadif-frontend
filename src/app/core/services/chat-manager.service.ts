import { Injectable, signal } from "@angular/core";
import BaseService from "./base.service";
import { debounceTime, Observable, shareReplay, switchMap, tap } from "rxjs";
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

    private getData<T>(endpoint: string): Observable<T> {
        return this.httpClient.get<T>(this.getApiEndpoint(endpoint)).pipe(
            shareReplay(1)  
        );
    }

    private postData<T>(endpoint: string, body: any): Observable<T> {
        return this.httpClient.post<T>(this.getApiEndpoint(endpoint), body);
    }


    leavePrivateChat(roomId: string): Observable<ChatPrivate[]> {
        return this.httpClient.get<{ leave: boolean }>(this.getApiEndpoint(`leave-private-chat/${roomId}`)).pipe(
            switchMap(() => this.listPrivateChat())  
        );
    }

    createPrivateChat(participantTwoId: string): Observable<{ roomId: string }> {
        return this.postData('create-private', { participantTwoId });
    }

    listPrivateChat(): Observable<ChatPrivate[]> {
        return this.getData<ChatPrivate[]>('list-private').pipe(
            tap(chats => this.privateChats.set(chats))  
        );
    }

    listMessagesFromChat(roomId: string): Observable<ChatMessage[]> {
        return this.getData<ChatMessage[]>(`messages-from-private/${roomId}`);
    }
}