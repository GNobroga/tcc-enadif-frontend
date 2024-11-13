import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { INotepad } from "../interfaces/notepad";
import BaseService from "./base.service";
import { Observable, switchMap } from "rxjs";
import { tap, shareReplay } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export default class NotepadService extends BaseService {
    
    constructor() {
        super('notes');
    }

    notepads = signal<INotepad[]>([]);


    private getData<T>(endpoint: string): Observable<T> {
        return this.httpClient.get<T>(this.getApiEndpoint(endpoint)).pipe(
            shareReplay(1) 
        );
    }

    private postData<T>(endpoint: string, body: any): Observable<T> {
        return this.httpClient.post<T>(this.getApiEndpoint(endpoint), body);
    }


    private putData<T>(endpoint: string, body: any): Observable<T> {
        return this.httpClient.put<T>(this.getApiEndpoint(endpoint), body);
    }


    private deleteData(endpoint: string): Observable<void> {
        return this.httpClient.delete<void>(this.getApiEndpoint(endpoint));
    }


    listAll(): Observable<INotepad[]> {
        return this.getData<INotepad[]>('')
            .pipe(
                tap(result => this.notepads.set(result)),
                shareReplay(1) 
            );
    }

    findById(id: string): Observable<INotepad> {
        return this.getData<INotepad>(id);
    }

    create(record: Partial<INotepad>): Observable<INotepad[]> {
        return this.postData<INotepad>('create', record)
            .pipe(
                switchMap(() => this.listAll())
            );
    }

    update(id: string, record: Partial<INotepad>): Observable<INotepad[]> {
        return this.putData<INotepad>(id, record)
            .pipe(
                switchMap(() => this.listAll()) 
            );
    }


    deleteById(id: string): Observable<INotepad[]> {
        return this.deleteData(id)
            .pipe(
                switchMap(() => this.listAll()) 
            );
    }
}