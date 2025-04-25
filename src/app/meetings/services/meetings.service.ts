import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  getAllFrom(id: number) {
    this.http
      .get<MeetingResponse>(`${this.serverUrl}/type-of-meeting/${id}`)
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
        error: (err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });
        },
      });
  }

  getAll() {
    this.http.get<MeetingResponse>(`${this.serverUrl}`).subscribe({
      next: (resp: MeetingResponse) => {
        const meetings: Meeting[] = resp.data as Meeting[];
        of(meetings).subscribe((result) => {
          result.forEach((m) => {
            this.state().meetings.set(m.id, m);
          });
          this.state.set({ meetings: this.state().meetings });
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

  getById(id: string): Observable<MeetingResponse> {
    return this.http
      .get<MeetingResponse>(`${this.serverUrl}/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getInfo(id: number): Observable<Meeting | undefined> {
    return this.http.get<MeetingResponse>(`${this.serverUrl}/info/${id}`).pipe(
      switchMap((resp: MeetingResponse) => of(resp.data as Meeting)),
      catchError((err: HttpErrorResponse) => {
        this.notificatorService.notificate({
          severity: 'error',
          summary: 'ERROR',
          detail: err.error.message,
        });
        return of(undefined);
      })
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
        catchError((err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });
          return of(undefined);
        })
      );
  }

  remove(meeting: Meeting): Observable<MeetingResponse> {
    return this.http
      .patch<MeetingResponse>(`${this.serverUrl}/${meeting.id}`, meeting)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
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
        catchError((err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });
          return of(undefined);
        })
      );
  }

  setOpen(id: number): Observable<Meeting | undefined> {
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
        catchError((err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });
          return of(undefined);
        })
      );
  }

  setClose(id: number): Observable<Meeting | undefined> {
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
        catchError((err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });
          return of(undefined);
        })
      );
  }

  // getOrganization(id: string): Observable<OrganizationResponse> {
  //   return this.http
  //     .get<OrganizationResponse>(`${this.serverUrl}/organization/${id}`)
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }
}
