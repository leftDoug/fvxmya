import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { baseUrl } from '@app/environment/environment.development';
import {
  LoginCredentials,
  LoginResponse,
  PasswordChangeRequest,
  TokenResponse,
} from '@app/models';
import { NotificatorService } from '@app/services/notificator.service';
import { DataService } from '@app/shared/services/data.service';
import { TokenService } from '@app/shared/services/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  catchError,
  Observable,
  of,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';
import { Role, UserInfo } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly serverUrl = `${baseUrl}/auth`;
  private readonly notificatorService = inject(NotificatorService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);
  private jwtHelper = new JwtHelperService();
  // private state = signal({ users: new Map<string, User>() });
  // private users = signal<Map<string, User>>(new Map());
  private currentUser = signal<UserInfo | null>(null);
  private isAuthenticated = signal<boolean>(false);
  // private userIsAuthenticated = signal<boolean>(false);
  private refreshInFlight$: Observable<string> | null = null;

  constructor() {
    if (
      this.tokenService.getAuthToken() &&
      this.tokenService.isAuthenticated()
    ) {
      this.loadCurrentUser();
    }
  }

  // TODO borrar
  // getAllFormatted(): User[] {
  //   return Array.from(this.users().values());
  // }

  // getAllWorkersFormatted(): User[] {
  //   return Array.from(this.state().users.values());
  // }

  // getAll(): void {
  //   this.http.get<UserResponse>(`${this.serverUrl}/users`).subscribe({
  //     next: (resp) => {
  //       const usrs: User[] = resp.data as User[];

  //       this.users.update((currentUsers) => {
  //         const newMap = new Map(currentUsers);

  //         usrs.forEach((usr) => newMap.set(usr.id, usr));

  //         return newMap;
  //       });
  //     },
  //   });
  // }

  // getAllWorkers(): void {
  //   this.http.get<UserResponse>(`${this.serverUrl}/workers`).subscribe({
  //     next: (resp: UserResponse) => {
  //       const workers: UserWorker[] = resp.data as User[];

  //       this.users.update((currentUsers) => {
  //         const newMap = new Map(currentUsers);

  //         workers.forEach((wkr) => newMap.set(wkr.id, wkr));

  //         return newMap;
  //       });
  //     },
  //   });
  // }

  // getMembersFrom(id: number): Observable<User[] | []> {
  //   return this.http
  //     .get<UserResponse>(`${this.serverUrl}/organization/${id}`)
  //     .pipe(
  //       switchMap((resp: UserResponse) => {
  //         return of(resp.data as User[]);
  //       }),
  //       catchError((err: HttpErrorResponse) => {
  //         this.notificatorService.notificate({
  //           severity: 'error',
  //           summary: 'ERROR',
  //           detail: err.message,
  //         });
  //         return of([]);
  //       })
  //     );
  // }

  changePassword(passwords: PasswordChangeRequest): Observable<boolean> {
    return this.http
      .post<TokenResponse>(`${this.serverUrl}/change-password`, passwords)
      .pipe(
        switchMap((resp) => {
          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });

          const authToken = resp.authToken as string;
          const newRefreshToken = resp.refreshToken as string;

          this.tokenService.saveTokens(authToken, newRefreshToken);

          this.loadCurrentUser();

          return of(true);
        })
      );
  }

  loadCurrentUser(): void {
    const token = localStorage.getItem('auth-token');

    if (token) {
      this.currentUser.set(this.jwtHelper.decodeToken(token));
    } else {
      this.currentUser.set(null);
    }
  }

  getCurrentUserId(): string | undefined {
    if (!this.currentUser()) {
      this.loadCurrentUser();
    }

    return this.currentUser()?.id;
  }

  getCurrentUserUsername(): string | undefined {
    if (!this.currentUser()) {
      this.loadCurrentUser();
    }

    return this.currentUser()?.username;
  }

  isAdmin(): boolean {
    if (!this.currentUser()) {
      this.loadCurrentUser();
    }

    return this.currentUser()?.role === Role.ADMIN;
  }

  isLeader(): boolean {
    if (!this.currentUser()) {
      this.loadCurrentUser();
    }

    return this.currentUser()?.role === Role.ORG_LEADER;
  }

  // updateAuthenticatedStatus(): void {
  //   this.userIsAuthenticated.set(this.tokenService.isAuthenticated());
  // }

  // isAuthenticated(): boolean {
  //   return this.userIsAuthenticated();
  // }

  checkAuthStaus2(): Observable<boolean> {
    if (!this.tokenService.hasTokens()) {
      this.isAuthenticated.set(false);

      return of(false);
    }

    if (this.tokenService.isAuthenticated()) {
      this.isAuthenticated.set(true);

      return of(true);
    }

    return this.refreshToken().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkAuthStaus(): Observable<boolean> {
    if (!this.tokenService.hasTokens()) {
      this.isAuthenticated.set(false);

      return of(false);
    }

    if (this.tokenService.isAuthenticated()) {
      if (!this.getCurrentUserId() || !this.getCurrentUserUsername()) {
        this.loadCurrentUser();
      }
      this.isAuthenticated.set(true);

      return of(true);
    }

    // evita que se haga refresh 2 veces seguidas
    // mientras esté así solo se saldrá de la app cuando expire el refresh
    const refreshToken = this.tokenService.getRefreshToken();
    const authenticated =
      !!refreshToken && !this.tokenService.isTokenExpired(refreshToken);

    if (authenticated) {
      this.isAuthenticated.set(true);

      return of(true);
    }

    this.isAuthenticated.set(false);

    return of(false);
    // fin

    // return this.refreshToken().pipe(
    //   switchMap(() => {
    //     this.isAuthenticated.set(true);

    //     return of(true);
    //   }),
    //   catchError(() => {
    //     this.isAuthenticated.set(false);
    //     this.logout();

    //     return of(false);
    //   })
    // );
  }

  getAuthStatus(): boolean {
    return this.isAuthenticated();
  }

  // checkAuthenticated(): Observable<boolean> {
  //   this.updateAuthenticatedStatus();

  //   const authenticated = this.userIsAuthenticated();

  //   if (authenticated) {
  //     return of(true);
  //   }

  //   if (
  //     this.tokenService.getAuthToken() &&
  //     this.tokenService.getRefreshToken()
  //   ) {
  //     return this.refreshToken().pipe(
  //       switchMap(() => of(true)),
  //       catchError(() => of(false))
  //     );
  //   }

  //   this.logout();

  //   return of(false);
  // }

  // isAuthenticated(): boolean {
  //   return this.userIsAuthenticated();
  // }

  // isTokenExpired(): boolean {
  //   const authToken = this.tokenService.getAuthToken();

  //   if (authToken) {
  //     return this.tokenService.isTokenExpired(authToken);
  //   }

  //   return true;
  // }

  login(credentials: LoginCredentials): Observable<boolean> {
    return this.http
      .post<LoginResponse>(`${this.serverUrl}/login`, credentials)
      .pipe(
        switchMap((resp) => {
          const authToken = resp.authToken as string;
          const refreshToken = resp.refreshToken as string;

          this.tokenService.saveTokens(authToken, refreshToken);

          this.loadCurrentUser();

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'Sesión iniciada',
            detail: resp.message,
          });

          if (this.isLeader()) {
            this.dataService.loadData();
          }

          return of(true);
        }),
        catchError(() => of(false))
      );
  }

  logout(): void {
    console.log('llamada');
    const refreshToken = this.tokenService.getRefreshToken();

    console.log(refreshToken);

    this.http
      .post(`${this.serverUrl}/logout`, {
        refreshToken,
      })
      .subscribe(() => {
        this.tokenService.removeTokens();
        this.currentUser.set(null);
        this.router.navigate(['iniciar-sesion']);
      });
  }

  refreshToken(): Observable<string> {
    if (!this.refreshInFlight$) {
      const refreshToken = this.tokenService.getRefreshToken();

      this.refreshInFlight$ = this.http
        .post<TokenResponse>(`${this.serverUrl}/refresh`, { refreshToken })
        .pipe(
          switchMap((resp) => {
            const authToken = resp.authToken as string;
            const newRefreshToken = resp.refreshToken as string;
            this.refreshInFlight$ = null;

            this.tokenService.saveTokens(authToken, newRefreshToken);
            this.isAuthenticated.set(true);

            return of(authToken);
          }),
          shareReplay(1),
          catchError((err) => {
            this.refreshInFlight$ = null;

            return throwError(() => err);
          })
          // tap({
          //   complete: () => {
          //     this.refreshInFlight$ = null;
          //   },
          // })
        );
    }

    return this.refreshInFlight$;

    // return this.http
    //   .post<TokenResponse>(`${this.serverUrl}/refresh`, { refreshToken })
    //   .pipe(
    //     switchMap((resp) => {
    //       const authToken = resp.authToken as string;
    //       const newRefreshToken = resp.refreshToken as string;

    //       this.tokenService.saveTokens(authToken, newRefreshToken);

    //       return of(authToken);
    //     }),
    //     catchError((err) => throwError(() => err))
    //   );
  }
}
