import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import {
  User,
  UserResponse,
  UserState,
  UserWorker,
  WorkerState,
} from '@app/auth/interfaces/user.interface';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';
import { catchError, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly serverUrl = `${baseUrl}/users`;
  private readonly notificatorService = inject(NotificatorService);
  private users = signal<Map<string, User>>(new Map());

  constructor() {}

  getAllUsersFormatted(): User[] {
    return Array.from(this.users().values());
  }

  getAllWorkersFormatted(): UserWorker[] {
    return Array.from(this.users().values()) as UserWorker[];
  }

  getAllUsers(): void {
    this.http.get<UserResponse>(this.serverUrl).subscribe({
      next: (resp) => {
        const usrs: User[] = resp.data as User[];

        this.users.update((currentUsers) => {
          const newMap = new Map(currentUsers);

          usrs.forEach((usr) => newMap.set(usr.id, usr));

          return newMap;
        });
      },
    });
  }

  getAllWorkers() {
    this.http.get<UserResponse>(`${this.serverUrl}/workers`).subscribe({
      next: (resp: UserResponse) => {
        const workers: UserWorker[] = resp.data as UserWorker[];

        this.users.update((currentUsers) => {
          const newMap = new Map(currentUsers);

          workers.forEach((w) => newMap.set(w.id, w));

          return newMap;
        });
      },
    });
  }

  // TODO implementarlo de esta manera en todos
  getUserById(id: string): Signal<UserState> {
    const currentUsers = this.users();

    if (!currentUsers.has(id)) {
      this.http.get<UserResponse>(`${this.serverUrl}/${id}`).subscribe({
        next: (resp) => {
          const usr: User = resp.data as User;

          this.users.update((currentUsers) => {
            return new Map(currentUsers).set(usr.id, usr);
          });
        },
      });
    }

    return computed<UserState>(() => ({
      data: this.users().get(id),
      loading: !this.users().has(id),
    }));
  }

  getWorkerById(id: string): Signal<WorkerState> {
    const currentUsers = this.users();

    if (!currentUsers.has(id)) {
      this.http.get<UserResponse>(`${this.serverUrl}/worker/${id}`).subscribe({
        next: (resp) => {
          const wrkr: UserWorker = resp.data as UserWorker;

          this.users.update((currentUsers) => {
            return new Map(currentUsers).set(wrkr.id, wrkr);
          });
        },
      });
    }

    return computed<WorkerState>(() => ({
      data: this.users().get(id),
      loading: !this.users().has(id),
    }));
  }

  create(user: User): Observable<boolean> {
    return this.http.post<UserResponse>(this.serverUrl, user).pipe(
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
      catchError(() => of(false))
    );
  }

  update(user: User): Observable<boolean> {
    return this.http
      .patch<UserResponse>(`${this.serverUrl}/${user.id}`, user)
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
        catchError(() => of(false))
      );
  }

  unlock(id: string): void {
    this.http
      .patch<UserResponse>(`${this.serverUrl}/unlock/${id}`, null)
      .subscribe({
        next: (resp) => {
          const usr: User = resp.data as User;

          this.users.update((currentUsers) =>
            new Map(currentUsers).set(usr.id, usr)
          );

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });
        },
      });
  }

  lock(id: string): void {
    this.http
      .patch<UserResponse>(`${this.serverUrl}/lock/${id}`, null)
      .subscribe({
        next: (resp) => {
          const usr: User = resp.data as User;

          this.users.update((currentUsers) =>
            new Map(currentUsers).set(usr.id, usr)
          );

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });
        },
      });
  }
}
