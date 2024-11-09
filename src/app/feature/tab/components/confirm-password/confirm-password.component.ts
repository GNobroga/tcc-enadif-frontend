import { Component } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
    selector: 'app-confirm-password',
    template: `
       <div class="space-y-6 p-4 bg-white max-w-sm mx-auto ">
    
    <!-- Campo de Senha -->
    <div class="relative">
        <input 
            type="password" 
            [(ngModel)]="password" 
            pInputText 
            placeholder="Confirme sua Senha" 
            class="w-full p-3 rounded-md border border-gray-300 focus:ring focus:ring-[var(--ion-color-primary)] focus:border-[var(--ion-color-primary)] text-gray-700"
        />

    </div>
    
    <!-- Botão de Confirmação -->
    <button 
        (click)="confirm()" 
        pButton 
        label="Confirmar" 
        class="w-full py-3 bg-[var(--ion-color-primary)] text-white rounded-md font-medium hover:bg-[var(--ion-color-primary-shade)] flex items-center justify-center transition duration-200"
    ></button>
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