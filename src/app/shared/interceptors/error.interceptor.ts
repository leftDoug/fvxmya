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
  const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        if (err.error.expired) {
          if (!tokenService.getIsRefreshing()) {
            tokenService.startRefreshing();
            refreshTokenSubject.next(null);

            return authService.refreshToken().pipe(
              switchMap((tokens) => {
                tokenService.stopRefreshing();

                refreshTokenSubject.next(tokens.authToken);

                return next(addToken(req, tokens.authToken!));
              }),
              catchError((err: HttpErrorResponse) => {
                tokenService.stopRefreshing();

                notificateError(err.error.message, notificatorService);

                authService.logout();

                return throwError(() => err.error);
              })
            );
          } else {
            return refreshTokenSubject.pipe(
              filter((token) => token !== null),
              take(1),
              switchMap((token) => next(addToken(req, token)))
            );
          }
        }

        notificateError(err.error.message, notificatorService);

        authService.logout();

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

// const refreshToken = (
//   req: HttpRequest<unknown>,
//   isRefreshing:boolean,
//   authService: AuthService,
//   notificatorService: NotificatorService,
//   next: HttpHandlerFn
// ) => {
//   console.log('refreshing token');

//   return authService.refreshToken().pipe(
//     switchMap((resp: TokenResponse) => {
//       isRefreshing=false
//       const authToken = resp.authToken as string;
//       const modReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       return next(modReq);
//     }),
//     catchError((err: HttpErrorResponse) => {
//       notificateError(err.error.message, notificatorService);

//       return throwError(() => err.error);
//     })
//   );
// };

// // const authService = inject(AuthService);
// // const tokenService = inject(TokenService);
// // const notificatorService = inject(NotificatorService);

// export const errorInterceptor: HttpInterceptorFn = (req, next) => {
//   // const authService=inject(AuthService)
//   const tokenService = inject(TokenService);
//   const notificatorService = inject(NotificatorService);

//   return next(req).pipe(
//     catchError((err: HttpErrorResponse) => {
//       if (err.status === 401 && err.error.expired) {
//         return callRefreshToken(req, next);

//         // authService.refreshToken().pipe(
//         //   switchMap(()=>{
//         //     const authToken=tokenService.getAccessToken()
//         //     const modifiedReq=req.clone({
//         //       setHeaders:{
//         //         Authorization:`Bearer ${authToken}`
//         //       }
//         //     })

//         //     return next(modifiedReq)
//         //   }),
//         //   catchError((err:HttpErrorResponse)=>{
//         //     tokenService.removeTokens()
//         //     authService.logout()
//         //     return next(req)
//         //   })
//         // )
//       }

//       if (err.status === 403 || err.status === 401) {
//         notificatorService.notificate({
//           severity: 'error',
//           summary: 'ERROR',
//           detail: err.error.message,
//         });

//         if (err.status === 401) {
//           return callLogout(req, next);
//         }
//       }

//       if (!tokenService.getRefreshToken()) {
//         notificatorService.notificate({
//           severity: 'error',
//           summary: 'ERROR',
//           detail:
//             'Debe estar autenticado en el sistema para realizar esta acción',
//         });

//         return callLogout(req, next);
//         // tokenService.removeTokens()
//         // authService.logout()
//         // return next(req)
//       }

//       notificatorService.notificate({
//         severity: 'error',
//         summary: 'ERROR',
//         detail: err.error.message,
//       });

//       return throwError(() => err.error);
//     })
//   );
// };

// const callRefreshToken = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
//   const authService = inject(AuthService);
//   const tokenService = inject(TokenService);
//   console.log('entra');

//   return authService.refreshToken().pipe(
//     switchMap(() => {
//       const authToken = tokenService.getAccessToken();
//       const modifiedReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       });

//       return next(modifiedReq);
//     }),
//     catchError((err: HttpErrorResponse) => {
//       return callLogout(req, next);
//       // tokenService.removeTokens()
//       // authService.logout()
//       // return next(req)
//     })
//   );
// };

// const callLogout = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
//   const authService = inject(AuthService);
//   const tokenService = inject(TokenService);

//   tokenService.removeTokens();
//   authService.logout();
//   return next(req);
// };
