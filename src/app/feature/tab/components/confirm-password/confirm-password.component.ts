import { Component } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
    selector: 'app-confirm-password',
    template: `
        <div class="space-y-5">
            <input type="password" [(ngModel)]="password" variant="filled" pInputText placeholder="Confirme sua Senha" class="w-full"/>
            <button (click)="confirm()" pButton class="w-full p-3 flex justify-center rounded-md font-medium">Confirmar</button>
        </div>
    `,
})
export default class ConfirmPasswordComponent {

    password = '';

    constructor(
        readonly dialogRef: DynamicDialogRef,
    ) { }

    confirm() {
        this.dialogRef.close(this.password);
    }
    
}