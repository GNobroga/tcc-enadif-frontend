import { Component, OnInit, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Auth, user } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, signOut, updateProfile } from '@firebase/auth';
import { LoadingController } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import AuthService from 'src/app/core/services/auth.service';
import UserService from 'src/app/core/services/user.service';
import CustomValidators from 'src/app/core/validators/custom-validators';

@Component({
  selector: 'app-create-account-page',
  templateUrl: './create-account-page.component.html',
  styleUrls: ['./create-account-page.component.scss'],
  providers: [MessageService],
})
export class CreateAccountPageComponent implements OnInit {

  loading = signal(false);

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmationPassword: new FormControl(''),
  });

  constructor(
    readonly messageService: MessageService,
    readonly authService: AuthService,
    readonly router: Router,
    readonly userService: UserService,
    readonly loadingController: LoadingController,
  ) {}
 
  ngOnInit() {
    this.form.controls.confirmationPassword.setValidators([
      Validators.required,
      CustomValidators.passwordMatcher(this.form.controls.password)
    ]);
  }

  async register() {
    const loading = await this.loadingController.create({
      animated: true,
      mode: 'ios',
      spinner: 'crescent',
    });

    await loading.present();

    try {
      if (!this.validateControls()) return;
      const { name, email, password } = this.form.value as { name: string, email: string, password: string };
      await this.authService.signUp({ name, email, password });
    } catch (error) {
      if (error instanceof FirebaseError) {
        this.handleFirebaseErrors(error);
      }
    } finally {
      this.loading.set(false);
      await loading.dismiss();
    }
  }

  handleFirebaseErrors(error: FirebaseError) {
    const code = error.code;
    if (code === 'auth/invalid-credential') {
      this.messageService.add({
        severity: 'warn',
        detail: 'Email ou senha incorretos'
      });
    } else if (code === 'auth/email-already-in-use') {
      this.messageService.add({
        severity: 'warn',
        detail: 'Email já cadastrado'
      });
    } else if (code === 'auth/weak-password') {
      this.messageService.add({
        severity: 'warn',
        detail: 'Senha precisa ter pelo menos 6 caracteres',
      });
    }
  }

  validateControls() {
    const controls = this.form.controls;
    const listControlName = Object.keys(controls);
    const labels: { [key: string]: string } = {
      name: 'nome',
      password: 'senha',
      confirmationPassword: 'senha de confirmação',
    };

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
      } else if (control.hasError('mismatch')) {
        this.messageService.add({
          severity: 'info',
          detail: `O ${label} não corresponde a senha`,
        });
      } else if (control.hasError('minlength')) {
        const { requiredLength } = control.getError('minlength');
        this.messageService.add({
          severity: 'info',
          detail: `O campo ${label} deve ter no mínimo ${requiredLength} caracteres`,
        });
      }
    } 
    return this.form.valid;
  }


}
