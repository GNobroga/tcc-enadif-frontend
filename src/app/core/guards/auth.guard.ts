import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isNullOrEmpty } from '../utils/is-null';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  return new Observable(observer => {
    auth.onAuthStateChanged(async user => {
      if (isNullOrEmpty(user)) {
        router.navigate(['account', 'login']);
        observer.next(false);
      } else {
        console.log(await user?.getIdToken())
        observer.next(true);
      }
    });
  });
};
