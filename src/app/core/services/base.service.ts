import { environment } from "src/environments/environment";

export default abstract class BaseService {

    constructor(public baseEndpoint: string) {}

    getApiEndpoint(complement: string = '') {
        let endpoint = `${environment.apiUrl}/api/v1/${this.baseEndpoint}`;
        if (complement?.trim() !== '') {
            endpoint += '/' + complement;
        } 
        return endpoint;
    }
} 