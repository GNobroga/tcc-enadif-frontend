import { inject } from '@angular/core';
import { Auth } from "@angular/fire/auth";
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

export const authRedirectGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth)
  const navController = inject(NavController);
  return new Observable(subscriber => {
    auth.onAuthStateChanged(user => {
      if (user) {
        navController.navigateRoot('/tabs/home');
        subscriber.next(false);
        return;
      } 
      subscriber.next(true);
    });
  });
};
