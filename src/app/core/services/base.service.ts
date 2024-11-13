import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Inject } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { environment } from "src/environments/environment";

export default abstract class BaseService {

    protected httpClient: HttpClient = inject(HttpClient);

    constructor(public baseEndpoint: string) {}

    getApiEndpoint(complement: string = '') {
        let endpoint = `${environment.apiUrl}api/v1/${this.baseEndpoint}`;
        if (complement?.trim() !== '') {
            endpoint += '/' + complement;
        } 
        return endpoint;
    }

} 