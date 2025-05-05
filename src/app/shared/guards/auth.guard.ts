import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { NotificatorService } from '@app/services/notificator.service';
import { map } from 'rxjs';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const notificatorService = inject(NotificatorService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return authService.checkAuthStaus().pipe(
    map((authenticated) => {
      if (authenticated) {
        return true;
      }

      const refreshToken = tokenService.getRefreshToken();

      if (refreshToken && !tokenService.isTokenExpired(refreshToken)) {
        return true;
      }

      notificatorService.notificate({
        severity: 'error',
        summary: 'ERROR',
        detail: 'GUARD: Debe iniciar sesión para acceder a esta página',
      });

      router.navigate(['iniciar-sesion']);

      return false;
    })
  );
};

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const notificatorService = inject(NotificatorService);
//   const isAuthenticated = computed(() => authService.isAuthenticated());

//   authService.updateAuthenticatedStatus();

//   if (isAuthenticated()) {
//     return true;
//   }

//   return authService.refreshToken().pipe(
//     switchMap(() => {
//       authService.updateAuthenticatedStatus();

//       return of(true);
//     }),
//     catchError(() => {
//       notificatorService.notificate({
//         severity: 'error',
//         summary: 'ERROR',
//         detail: 'Debe iniciar sesión para acceder a esta página',
//       });

//       authService.logout();

//       return of(false);
//     })
//   );
// };
