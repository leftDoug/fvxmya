import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { NotificatorService } from '@app/services/notificator.service';
import { BehaviorSubject, catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificatorService = inject(NotificatorService);
  const tokenService = inject(TokenService);
  const refreshSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  let refreshInProgress = false;

  // TODO falta gestionar la manera en k se comporta para las rutas
  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        if (err.error.expired) {
          // if (!refreshInProgress) {
          // refreshInProgress = true;

          // refreshSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((token) => {
              // refreshInProgress = false;

              return next(addToken(req, token));
            }),
            catchError((err) => {
              // refreshInProgress = false;

              // if (
              // tokenService.isTokenExpired(tokenService.getRefreshToken()!)
              // ) {
              if (err instanceof HttpErrorResponse) {
                notificateError(err.error.message, notificatorService);
              }

              authService.logout();
              // }

              return throwError(() => err);
            })
          );
          // } else {
          //   return refreshSubject.pipe(
          //     filter((token) => token !== null),
          //     take(1),
          //     switchMap((token) => next(addToken(req, token)))
          //   );
          // }
        }

        if (err instanceof HttpErrorResponse) {
          notificateError(err.error.message, notificatorService);
        }

        // if (tokenService.isTokenExpired(tokenService.getRefreshToken()!)) {
        authService.logout();
        // }

        return throwError(() => err.error);
      }

      if (err instanceof HttpErrorResponse) {
        notificateError(err.error.message, notificatorService);
      }

      return throwError(() => err);
    })
  );
};

const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const notificateError = (message: string, notificator: NotificatorService) => {
  notificator.notificate({
    severity: 'error',
    summary: 'ERROR',
    detail: message,
  });
};
