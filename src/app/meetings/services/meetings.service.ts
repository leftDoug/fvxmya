import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { Meeting, MeetingResponse } from '../interfaces/meeting.interface';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';

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

  add(meeting: Meeting): Observable<MeetingResponse> {
    return this.http
      .post<MeetingResponse>(`${this.serverUrl}`, meeting)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  update(meeting: Meeting): Observable<MeetingResponse> {
    return this.http
      .patch<MeetingResponse>(`${this.serverUrl}/${meeting.id}`, meeting)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
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

  setOpen(id: number): Observable<Meeting | undefined> {
    return this.http
      .patch<MeetingResponse>(`${this.serverUrl}/open/${id}`, null)
      .pipe(
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

  setClose(id: number): Observable<Meeting | undefined> {
    return this.http
      .patch<MeetingResponse>(`${this.serverUrl}/close/${id}`, null)
      .pipe(
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

  // getOrganization(id: string): Observable<OrganizationResponse> {
  //   return this.http
  //     .get<OrganizationResponse>(`${this.serverUrl}/organization/${id}`)
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }
}
