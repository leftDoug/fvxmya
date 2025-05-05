import type {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const authToken = tokenService.getAuthToken();

  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  if (authToken) {
    req = addHeaders(req, authToken);
  }

  return next(req);
  // .pipe(
  //   catchError((err: HttpErrorResponse) => {
  //     if (err.status === 401) {
  //       if (err.error.expired) {
  //         return authService.refreshToken().pipe(
  //           switchMap((resp: TokenResponse) => {
  //             const authToken = resp.authToken as string;
  //             const modReq = addHeaders(req, authToken);

  //             return next(modReq);
  //           })
  //         );
  //       }

  //       authService.logout()
  //       return next(req)
  //     }

  //     return throwError(() => new Error(err.error));
  //   })
  // );
  // return next(modifiedReq).pipe(
  //   catchError((err: HttpErrorResponse) => {
  //     if (err.status === 401 && err.error.expired) {
  //       isRefreshing = true;
  //       return handle401Error(modifiedReq, authService, tokenService, next);
  //     }

  //     return throwError(() => err);
  //   })
  // );
};

const addHeaders = (req: HttpRequest<unknown>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// let isRefreshing = false;

// export const tokenInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<unknown>,
//   next: HttpHandlerFn
// ) => {
//   // const authService = inject(AuthService);
//   const tokenService = inject(TokenService);
//   const authToken = tokenService.getAccessToken();

//   if (!authToken) {
//     return next(req);
//   }

//   const modifiedReq = addHeaders(req, authToken);

//   return next(modifiedReq);
//   // return next(modifiedReq).pipe(
//   //   catchError((err: HttpErrorResponse) => {
//   //     if (err.status === 401 && err.error.expired) {
//   //       isRefreshing = true;
//   //       return handle401Error(modifiedReq, authService, tokenService, next);
//   //     }

//   //     return throwError(() => err);
//   //   })
//   // );
// };

// const addHeaders = (req: HttpRequest<unknown>, token: string) => {
//   return req.clone({
//     setHeaders: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// // const handle401Error = (
// //   req: HttpRequest<unknown>,
// //   authService: AuthService,
// //   tokenService: TokenService,
// //   next: HttpHandlerFn
// // ) => {
// //   const refreshToken = tokenService.getRefreshToken();
// //   if (refreshToken && !isRefreshing) {
// //     return authService.refreshToken().pipe(
// //       switchMap(() => {
// //         isRefreshing = false;
// //         const authToken = tokenService.getAccessToken();
// //         const modifiedReq = addHeaders(req, authToken!);
// //         return next(modifiedReq);
// //       }),
// //       catchError(() => {
// //         isRefreshing = false;
// //         tokenService.removeTokens();
// //         authService.logout();
// //         return next(req);
// //       })
// //     );
// //   }

// //   if (!refreshToken) {
// //     tokenService.removeTokens();
// //     authService.logout();
// //     return next(req);
// //   }

// //   return next(req);
// // };
