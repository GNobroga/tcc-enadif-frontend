import { Injectable } from "@angular/core";
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export default class GeminiAPIService {

    readonly model!: GenerativeModel;

    constructor() {
        const genAI = new GoogleGenerativeAI(environment.geminiAPIKey);
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async sendMessage(text: string) {
        try {
            const result = await this.model.generateContent(text);
            return result.response.text();
        } catch (err) {
            throw new Error('Error sending message to gemini API');
        }
    }

}