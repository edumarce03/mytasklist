import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return toObservable(authService.currentUser).pipe(
    take(1),
    map((user) => {
      const isLoggedIn = !!user;

      if (isLoggedIn) {
        return true;
      }

      return router.createUrlTree(['/login']);
    })
  );
};

export const publicOnlyGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return toObservable(authService.currentUser).pipe(
    take(1),
    map((user) => {
      const isLoggedIn = !!user;

      if (!isLoggedIn) {
        return true;
      }

      return router.createUrlTree(['/profile']);
    })
  );
};
