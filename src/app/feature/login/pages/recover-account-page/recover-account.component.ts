import { Component } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { sendPasswordResetEmail } from "@firebase/auth";
import { MessageService } from "primeng/api";

@Component({
    selector: 'app-recover-account-page',
    templateUrl: './recover-account-page.component.html',
    styleUrl: './recover-account-page.component.scss',
    providers: [MessageService],
})
export default class RecoverAccountPageComponent {

    form = new FormGroup({
        email: new FormControl('', [Validators.email, Validators.required]),
    });

    constructor(
        readonly messageService: MessageService,
        readonly auth: Auth,
    ) {}

    sendEmail() {
        if (this.form.controls.email.invalid) {
            this.messageService.add({
                severity: 'warn',
                detail: 'Preencha o campo de E-mail.',
            });
            return;
        }
        const email = this.form.controls.email.value!;

        sendPasswordResetEmail(this.auth, email)
            .then(() => {
                this.messageService.add({
                    severity: 'info',
                    detail: 'E-mail enviado com sucesso.'
                })
            })
            .catch(() => {
                this.messageService.add({
                    severity: 'danger',
                    detail: 'Não foi possível enviar o Email.'
                })
            });
    }

}