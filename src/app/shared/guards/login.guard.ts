import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { map } from 'rxjs';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStaus().pipe(
    map((authenticated) => {
      if (authenticated) {
        router.navigate(['acuerdos']);
        return false;
      }

      return true;
    })
  );
};
