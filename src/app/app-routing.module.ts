import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuestGuard } from './core/guards/auth-guest.guard';
import { authGuard } from './core/guards/auth.guard';

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
    canActivate: [authGuestGuard],
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
