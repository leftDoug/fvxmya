import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { NotificatorService } from '@app/services/notificator.service';
import { map } from 'rxjs';
import { TokenService } from '../services/token.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const notificatorService = inject(NotificatorService);
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return authService.checkAuthStaus().pipe(
    map((authenticated) => {
      if (authenticated) {
        if (authService.isAdmin()) {
          return true;
        }

        notificatorService.notificate({
          severity: 'error',
          summary: 'ERROR',
          detail: 'GUARD ADMIN: No tiene permisos para acceder a esta página',
        });

        router.navigate(['acceso-denegado']);

        return false;
      }

      const refreshToken = tokenService.getRefreshToken();

      if (refreshToken && !tokenService.isTokenExpired(refreshToken)) {
        if (authService.isAdmin()) {
          return true;
        } else {
          notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: 'GUARD ADMIN: No tiene permisos para acceder a esta página',
          });

          router.navigate(['acceso-denegado']);

          return false;
        }
      }

      notificatorService.notificate({
        severity: 'error',
        summary: 'ERROR',
        detail: 'GUARD ADMIN: Debe iniciar sesión para acceder a esta página',
      });

      return false;
    })
  );
};

// export const adminGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const notificatorService = inject(NotificatorService);
//   const router = inject(Router);
//   const isAuthenticated = computed(() => authService.isAuthenticated());

//   authService.updateAuthenticatedStatus();

//   if (isAuthenticated()) {
//     if (authService.isAdmin()) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   return authService.refreshToken().pipe(
//     switchMap(() => {
//       authService.updateAuthenticatedStatus();

//       if (authService.isAdmin()) {
//         return of(true);
//       } else {
//         notificatorService.notificate({
//           severity: 'error',
//           summary: 'ERROR',
//           detail: 'No tiene permisos para acceder a esta página',
//         });

//         router.navigate(['acceso-denegado']);

//         return of(false);
//       }
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
