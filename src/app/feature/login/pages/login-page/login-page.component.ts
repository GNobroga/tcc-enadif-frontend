import { Component, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import AuthService from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  providers: [MessageService],
})
export class LoginPageComponent {

  loading = signal(false);

  form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
  });

  constructor(
    readonly loadingController: LoadingController,
    readonly messageService: MessageService,
    readonly router: Router,
    readonly authService: AuthService,
  ) {}

  async login() {
    try { 

      if (!this.validateControls()) {
        return;
      }

      this.loading.set(true);

      const { email, password } = this.form.value;

      if (await this.authService.signInDefault(email!, password!)) {
        this.router.navigate(['tabs']);
      }
      
    } catch(error) {
      if (error instanceof FirebaseError) {
        this.handleFirebaseErrors(error);
      }
    } finally {
      this.loading.set(false);
    }    
  }

  handleFirebaseErrors(error: FirebaseError) {
    const code = error.code;
    if (code === 'auth/invalid-credential') {
      this.messageService.add({
        severity: 'warn',
        detail: 'Email ou senha incorretos'
      });
    }
  }

  validateControls() {
    const controls = this.form.controls;
    const listControlName = Object.keys(controls);
    const labels = {
      password: 'senha',
    } as { [key: string]: string };
    for (const controlName of listControlName) {
      const control = controls[controlName as keyof typeof this.form.controls];
      const label = labels[controlName] ?? controlName;
      if (control.hasError('email')) {
        this.messageService.add({
          severity: 'info',
          detail: `O campo ${label} não é válido`,
        });
      } else if (control.hasError('required')) {
        this.messageService.add({
          severity: 'info',
          detail: `O campo ${label} é obrigatório`,
        });
      }
    }
    return this.form.valid;
  }

}
