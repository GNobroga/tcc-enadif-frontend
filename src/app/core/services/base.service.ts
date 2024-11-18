import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
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