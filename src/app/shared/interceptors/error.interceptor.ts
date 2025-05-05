import type {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { NotificatorService } from '@app/services/notificator.service';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { TokenService } from '../services/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificatorService = inject(NotificatorService);
  const tokenService = inject(TokenService);
  const refreshSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  let refreshInProgress = false;

  // TODO falta gestionar la manera en k se comporta para las rutas
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        if (err.error.expired) {
          if (!refreshInProgress) {
            refreshInProgress = true;

            refreshSubject.next(null);

            return authService.refreshToken().pipe(
              switchMap((token) => {
                refreshInProgress = false;

                return next(addToken(req, token));
              }),
              catchError((err: HttpErrorResponse) => {
                refreshInProgress = false;

                notificateError(err.error.message, notificatorService);

                if (
                  tokenService.isTokenExpired(tokenService.getRefreshToken()!)
                ) {
                  authService.logout();
                }

                return throwError(() => err.error);
              })
            );
          } else {
            return refreshSubject.pipe(
              filter((token) => token !== null),
              take(1),
              switchMap((token) => next(addToken(req, token)))
            );
          }
        }

        notificateError(err.error.message, notificatorService);

        if (tokenService.isTokenExpired(tokenService.getRefreshToken()!)) {
          authService.logout();
        }

        return throwError(() => err.error);
      }

      notificateError(err.error.message, notificatorService);

      return throwError(() => err.error);
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
