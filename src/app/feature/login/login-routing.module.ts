import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { AccountCreatedComponent } from './pages/account-created/account-created.component';
import { CreateAccountPageComponent } from './pages/create-account-page/create-account-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import RecoverAccountPageComponent from './pages/recover-account-page/recover-account.component';
import { authRedirectGuard } from 'src/app/core/guards/auth-redirect.guard';
import { authGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [authRedirectGuard],
      },
      {
        path: 'register',
        component: CreateAccountPageComponent,
        canActivate: [],
      },
      {
        path: 'recover',
        component: RecoverAccountPageComponent,
        canActivate: [authRedirectGuard],
      }
    ],
  },
  {
    path: 'created',
    component: AccountCreatedComponent,
    canActivate: [authGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
