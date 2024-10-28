import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, of, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  auth.currentUser?.getIdToken()

  if (!auth.currentUser) {
    return next(req);
  }

  const user = auth.currentUser!;

  return from(user.getIdToken())
    .pipe(switchMap(idToken => {
      const clone = req.clone({
        setHeaders: {
          Authorization: `Berear ${idToken}`,
        },
      });
      return next(clone);
    }));
};
