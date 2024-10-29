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
    constructor(private readonly httpClient: HttpClient) {
        super('notepads');
    }

    notepads = signal<INotepad[]>([]);

    /**
     * Método para listar todos os Notepads
     */
    listAll(): Observable<INotepad[]> {
        return this.httpClient.get<INotepad[]>(this.getApiEndpoint())
            .pipe(
                tap(result => this.notepads.set(result)), 
                shareReplay(1) 
            );
    }

    /**
     * Método para buscar um Notepad por ID
     * @param id ID do Notepad
     */
    findById(id: string): Observable<INotepad> {
        return this.httpClient.get<INotepad>(this.getApiEndpoint(id))
            .pipe(shareReplay(1));
    }

    /**
     * Método para criar um novo Notepad
     * @param record Dados do Notepad
     * @param ownerId ID do proprietário
     */
    create(record: Partial<INotepad>) {
        return this.httpClient.post<INotepad>(this.getApiEndpoint(), { ...record })
            .pipe(switchMap(() => this.listAll()));
    }

    /**
     * Método para atualizar um Notepad existente
     * @param id ID do Notepad
     * @param ownerId ID do proprietário
     * @param record Dados para atualização
     */
    update(id: string, record: Partial<INotepad>) {
        return this.httpClient.put<INotepad>(this.getApiEndpoint(id), { ...record, })
        .pipe(switchMap(() => this.listAll()));
    }

    /**
     * Método para deletar um Notepad por ID
     * @param id ID do Notepad
     * @param ownerId ID do proprietário
     */
    deleteById(id: string) {
        return this.httpClient.delete<void>(this.getApiEndpoint(id))
            .pipe(switchMap(() => this.listAll()));
    }
}
