import { Component } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
    selector: 'app-confirm-password',
    template: `

    <div class="relative mb-6">
       
        <div class="flex justify-center mb-5">
            <i class="fa-solid fa-lock text-5xl"></i>
        </div>

        <p>Digite sua senha, para prosseguir.</p>
        
        <input 
            type="password" 
            [(ngModel)]="password" 
            pInputText 
            placeholder="Digite sua senha" 
            class="w-full p-3 rounded-md border border-gray-300 focus:ring focus:ring-[var(--ion-color-primary)] focus:border-[var(--ion-color-primary)] text-gray-700"
        />
    </div>


    <button 
        (click)="confirm()" 
        pButton 
        label="Confirmar" 
        class="w-full py-3 bg-[var(--ion-color-primary)] text-white rounded-md font-medium hover:bg-[var(--ion-color-primary-shade)] flex items-center justify-center transition duration-200"
    ></button>

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