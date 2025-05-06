import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { NotificatorService } from '@app/services/notificator.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const notificatorService = inject(NotificatorService);
  const router = inject(Router);

  return authService.checkAuthStaus2().pipe(
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
//   const tokenService = inject(TokenService);

//   return authService.checkAuthStaus().pipe(
//     map((authenticated) => {
//       if (authenticated) {
//         if (authService.isAdmin()) {
//           return true;
//         }

//         notificatorService.notificate({
//           severity: 'error',
//           summary: 'ERROR',
//           detail: 'GUARD ADMIN: No tiene permisos para acceder a esta página',
//         });

//         router.navigate(['acceso-denegado']);

//         return false;
//       }

//       const refreshToken = tokenService.getRefreshToken();

//       if (refreshToken && !tokenService.isTokenExpired(refreshToken)) {
//         if (authService.isAdmin()) {
//           return true;
//         } else {
//           notificatorService.notificate({
//             severity: 'error',
//             summary: 'ERROR',
//             detail: 'GUARD ADMIN: No tiene permisos para acceder a esta página',
//           });

//           router.navigate(['acceso-denegado']);

//           return false;
//         }
//       }

//       notificatorService.notificate({
//         severity: 'error',
//         summary: 'ERROR',
//         detail: 'GUARD ADMIN: Debe iniciar sesión para acceder a esta página',
//       });

//       return false;
//     })
//   );
// };
