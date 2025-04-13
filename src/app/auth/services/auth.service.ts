import { inject, Injectable, signal } from '@angular/core';
import { User, UserResponse } from '../interfaces/user.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { baseUrl } from '@app/environment/environment.development';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { NotificatorService } from '@app/services/notificator.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly serverUrl = baseUrl + '/auth';
  private readonly notificatorService = inject(NotificatorService);
  private state = signal({ users: new Map<string, User>() });

  constructor() {}

  getAllWorkersFormatted(): User[] {
    return Array.from(this.state().users.values());
  }

  getAllWorkers() {
    this.http.get<UserResponse>(`${this.serverUrl}/workers`).subscribe({
      next: (resp: UserResponse) => {
        const worker: User[] = resp.data as User[];
        of(worker).subscribe((result) => {
          result.forEach((u) => {
            this.state().users.set(u.id, u);
          });
        });
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
