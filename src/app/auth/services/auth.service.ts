import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { User, UserResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly serverUrl = baseUrl + '/auth';
  private readonly notificatorService = inject(NotificatorService);
  private jwtHelper = new JwtHelperService();
  private state = signal({ users: new Map<string, User>() });
  private users = signal<Map<string, User>>(new Map());
  private userId?: string;

  constructor() {}

  getAllFormatted(): User[] {
    return Array.from(this.users().values());
  }

  getAllWorkersFormatted(): User[] {
    return Array.from(this.state().users.values());
  }

  getAll(): void {
    this.http.get<UserResponse>(`${this.serverUrl}/users`).subscribe({
      next: (resp) => {
        const usrs: User[] = resp.data as User[];

        this.users.update((currentUsers) => {
          const newMap = new Map(currentUsers);

          usrs.forEach((usr) => newMap.set(usr.id, usr));

          return newMap;
        });

        // of(users).subscribe((usrs) => {
        //   usrs.forEach((usr) => {
        //     this.state().users.set(usr.id, usr);
        //   });

        //   this.state.set({ users: this.state().users });
        // });
      },
      error: (err: HttpErrorResponse) => {
        this.notificatorService.notificate({
          severity: 'error',
          summary: 'ERROR',
          detail: err.error.message,
        });
      },
    });
  }

  getAllWorkers() {
    this.http.get<UserResponse>(`${this.serverUrl}/workers`).subscribe({
      next: (resp: UserResponse) => {
        const workers: User[] = resp.data as User[];
        // of(workers).subscribe((result) => {
        workers.forEach((u) => {
          this.state().users.set(u.id, u);
        });
        // });
        this.state.set({ users: this.state().users });
      },
      error: (err: HttpErrorResponse) => {
        this.notificatorService.notificate({
          severity: 'error',
          summary: 'ERROR',
          detail: err.message,
        });
      },
    });
  }

  getMembersFrom(id: number): Observable<User[] | []> {
    return this.http
      .get<UserResponse>(`${this.serverUrl}/organization/${id}`)
      .pipe(
        switchMap((resp: UserResponse) => {
          return of(resp.data as User[]);
        }),
        catchError((err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.message,
          });
          return of([]);
        })
      );
  }

  register(user: User): Observable<boolean> {
    return this.http
      .post<UserResponse>(`${this.serverUrl}/register`, user)
      .pipe(
        switchMap((resp) => {
          const usr: User = resp.data as User;

          this.users.update((currentUsers) => {
            return new Map(currentUsers).set(usr.id, usr);
          });

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'AGREGADO',
            detail: resp.message,
          });

          return of(true);
        }),
        catchError((err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });

          return of(false);
        })
      );
  }

  update(user: User): Observable<boolean> {
    return this.http
      .patch<UserResponse>(`${this.serverUrl}/users/${user.id}`, user)
      .pipe(
        switchMap((resp) => {
          const usr: User = resp.data as User;

          this.users.update((currentUsers) => {
            return new Map(currentUsers).set(usr.id, usr);
          });

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });

          return of(true);
        }),
        catchError((err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });

          return of(false);
        })
      );
  }

  changePassword(passwords: any): Observable<boolean> {
    const id = this.getUserId();

    if (id) {
      return this.http
        .patch<UserResponse>(
          `${this.serverUrl}/change-password/${id}`,
          passwords
        )
        .pipe(
          switchMap((resp) => {
            this.notificatorService.notificate({
              severity: 'success',
              summary: 'ACTUALIZADO',
              detail: resp.message,
            });

            return of(true);
          }),
          catchError((err: HttpErrorResponse) => {
            this.notificatorService.notificate({
              severity: 'error',
              summary: 'ERROR',
              detail: err.error.message,
            });

            return of(false);
          })
        );
    }

    this.notificatorService.notificate({
      severity: 'error',
      summary: 'ERROR',
      detail: 'La sesión ha expirado',
    });

    return of(false);
  }

  getUserId(): string | null {
    if (this.userId) {
      return this.userId;
    }

    const token = localStorage.getItem('auth-token');

    if (token) {
      return this.jwtHelper.decodeToken(token);
    }

    return null;
  }

  setLocked(id: string): void {
    this.http
      .patch<UserResponse>(`${this.serverUrl}/users/lock/${id}`, null)
      .subscribe({
        next: (resp) => {
          const user = this.users().get(id);

          if (user) {
            user.state = false;
            this.users.update((currentUsers) =>
              new Map(currentUsers).set(user.id, user)
            );
          }

          this.notificatorService.notificate({
            severity: 'info',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });
        },
        error: (err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });
        },
      });
  }

  setUnlocked(id: string): void {
    this.http
      .patch<UserResponse>(`${this.serverUrl}/users/unlock/${id}`, null)
      .subscribe({
        next: (resp) => {
          const user = this.users().get(id);

          if (user) {
            user.state = true;
            this.users.update((currentUsers) =>
              new Map(currentUsers).set(user.id, user)
            );
          }

          this.notificatorService.notificate({
            severity: 'info',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });
        },
        error: (err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });
        },
      });
  }
}
