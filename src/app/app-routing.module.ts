import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authRedirectGuard } from './core/guards/auth-redirect.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
  {
    path: 'account',
    loadChildren: () => import('./feature/login/login.module'),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./feature/tab/tab.module'),
    canActivate: [authGuard],
  },
  {
    path: 'welcome',
    loadChildren: () => import('./feature/welcome/welcome.module'),
    canActivate: [authRedirectGuard],
  },
  {
    path: 'quiz',
    loadChildren: () => import('./feature/quiz/quiz.module'),
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
        preloadingStrategy: PreloadAllModules,
        bindToComponentInputs: true
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
