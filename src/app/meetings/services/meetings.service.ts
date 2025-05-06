import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import {
  Meeting,
  MeetingResponse,
  Status as StatusMeeting,
} from '../interfaces/meeting.interface';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  private readonly http = inject(HttpClient);
  private readonly serverUrl = `${baseUrl}/meetings`;
  private readonly notificatorService = inject(NotificatorService);

  state = signal({ meetings: new Map<number, Meeting>() });

  constructor() {}

  getAllFormatted(): Meeting[] {
    return Array.from(this.state().meetings.values());
  }

  getAllFromLeader() {
    this.http.get<MeetingResponse>(`${this.serverUrl}/leader`).subscribe({
      next: (resp) => {
        const meets: Meeting[] = resp.data as Meeting[];
        of(meets).subscribe((result) => {
          result.forEach((meet) => {
            this.state().meetings.set(meet.id, meet);
          });
          this.state.set({ meetings: this.state().meetings });
        });
      },
    });
  }

  getAllFrom(id: number) {
    this.http
      .get<MeetingResponse>(`${this.serverUrl}/type-meeting/${id}`)
      .subscribe({
        next: (resp: MeetingResponse) => {
          const meetings: Meeting[] = resp.data as Meeting[];
          of(meetings).subscribe((result) => {
            result.forEach((m) => {
              this.state().meetings.set(m.id, m);
            });
            this.state.set({ meetings: this.state().meetings });
          });
        },
      });
  }

  // TODO borrar
  // getAll() {
  //   this.http.get<MeetingResponse>(`${this.serverUrl}`).subscribe({
  //     next: (resp: MeetingResponse) => {
  //       const meetings: Meeting[] = resp.data as Meeting[];
  //       of(meetings).subscribe((result) => {
  //         result.forEach((m) => {
  //           this.state().meetings.set(m.id, m);
  //         });
  //         this.state.set({ meetings: this.state().meetings });
  //       });
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       this.notificatorService.notificate({
  //         severity: 'error',
  //         summary: 'ERROR',
  //         detail: err.error.message,
  //       });
  //     },
  //   });
  // }

  // getById(id: string): Observable<MeetingResponse> {
  //   return this.http
  //     .get<MeetingResponse>(`${this.serverUrl}/${id}`)
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }

  getById(id: number): Observable<Meeting | undefined> {
    return this.http.get<MeetingResponse>(`${this.serverUrl}/${id}`).pipe(
      switchMap((resp: MeetingResponse) => {
        const meet: Meeting = resp.data as Meeting;

        this.state().meetings.set(meet.id, meet);
        this.state.set({ meetings: this.state().meetings });

        return of(meet);
      }),
      catchError(() => of(undefined))
    );
  }

  // getInfo(id: string): Observable<MeetingResponse> {
  //   return this.http
  //     .get<MeetingResponse>(`${this.serverUrl}/info/${id}`)
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }

  add(meeting: Meeting): Observable<boolean> {
    return this.http.post<MeetingResponse>(this.serverUrl, meeting).pipe(
      switchMap((resp) => {
        const m: Meeting = resp.data as Meeting;

        this.state().meetings.set(m.id, m);
        this.state.set({ meetings: this.state().meetings });

        this.notificatorService.notificate({
          severity: 'success',
          summary: 'AGREGADO',
          detail: resp.message,
        });

        return of(resp.ok);
      }),
      catchError(() => of(false))
    );
  }

  update(meeting: Meeting): Observable<Meeting | undefined> {
    return this.http
      .patch<MeetingResponse>(`${this.serverUrl}/${meeting.id}`, meeting)
      .pipe(
        switchMap((resp) => {
          const m: Meeting = resp.data as Meeting;

          this.state().meetings.set(m.id, m);
          this.state.set({ meetings: this.state().meetings });

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });

          return of(m);
        }),
        catchError(() => of(undefined))
      );
  }

  remove(id: number): void {
    this.http.delete<MeetingResponse>(`${this.serverUrl}/${id}`).subscribe({
      next: (resp) => {
        this.notificatorService.notificate({
          severity: 'info',
          summary: 'ELIMINADO',
          detail: resp.message,
        });
        this.state().meetings.delete(id);
        this.state.set({ meetings: this.state().meetings });
      },
    });
  }

  setAttendance(
    id: number,
    attendants: { attendants: string[] }
  ): Observable<Meeting | undefined> {
    return this.http
      .patch<MeetingResponse>(`${this.serverUrl}/attendance/${id}`, attendants)
      .pipe(
        switchMap((resp: MeetingResponse) => {
          const meet: Meeting = resp.data as Meeting;

          this.state().meetings.set(meet.id, meet);
          this.state.set({ meetings: this.state().meetings });

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });

          return of(meet);
        }),
        catchError(() => of(undefined))
      );
  }

  open(id: number): Observable<Meeting | undefined> {
    return this.http
      .patch<MeetingResponse>(`${this.serverUrl}/open/${id}`, null)
      .pipe(
        switchMap((resp) => {
          const meet: Meeting = this.state().meetings.get(id)!;
          meet.status = StatusMeeting.IN_PROCESS;

          this.state().meetings.set(meet.id, meet);
          this.state.set({ meetings: this.state().meetings });

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });

          return of(meet);
        }),
        catchError(() => of(undefined))
      );
  }

  close(id: number): Observable<Meeting | undefined> {
    return this.http
      .patch<MeetingResponse>(`${this.serverUrl}/close/${id}`, null)
      .pipe(
        switchMap((resp: MeetingResponse) => {
          const meet: Meeting = this.state().meetings.get(id)!;
          meet.status = StatusMeeting.CLOSED;

          this.state().meetings.set(meet.id, meet);
          this.state.set({ meetings: this.state().meetings });

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });

          return of(meet);
        }),
        catchError(() => of(undefined))
      );
  }

  // getOrganization(id: string): Observable<OrganizationResponse> {
  //   return this.http
  //     .get<OrganizationResponse>(`${this.serverUrl}/organization/${id}`)
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }
}
