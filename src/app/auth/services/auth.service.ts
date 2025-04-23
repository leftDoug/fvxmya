import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { User, UserResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly serverUrl = baseUrl + '/auth';
  private readonly notificatorService = inject(NotificatorService);
  private state = signal({ users: new Map<string, User>() });

  constructor() {
    this.getAllWorkers();
  }

  getAllWorkersFormatted(): User[] {
    return Array.from(this.state().users.values());
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
}
