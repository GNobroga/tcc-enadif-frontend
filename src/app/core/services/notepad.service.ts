import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { INotepad } from "../interfaces/notepad";
import BaseService from "./base.service";
import { shareReplay, tap } from "rxjs";

export interface Notepad {
    id: string;

}
@Injectable({
    providedIn: 'root',
})
export default class NotepadService extends BaseService {
    constructor(readonly httpClient: HttpClient) {
        super('notepads');
    }

    notepads = signal<INotepad[]>([]);

    get listAll() {
        return this.httpClient.get(this.getApiEndpoint())
            .pipe(
                tap(result => this.notepads.set(result as INotepad[])), 
                shareReplay()
            )
            .subscribe();
    }

    findById(id: string) {
        return this.httpClient.get(this.getApiEndpoint(`${id}`))
            .pipe(shareReplay());
    }

    
}