import { inject } from '@angular/core';
import { Auth } from "@angular/fire/auth";
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import AuthService from '../services/auth.service';

export const authRedirectGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth)
  const navController = inject(NavController);
  const authService = inject(AuthService);
  return new Observable(subscriber => {
    auth.onAuthStateChanged(user => {
      if (user && !authService.isNewAccount) {
        navController.navigateRoot('/tabs/home');
        subscriber.next(false);
        return;
      } 
      subscriber.next(true);
    });
  });
};
