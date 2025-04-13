import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
// import { environment } from 'src/environments/environment.development';
import {
  TypeOfMeeting,
  TypeOfMeetingResponse,
} from '../interfaces/type-of-meeting.interface';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
// import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
// import { AgendaResponse } from 'src/app/agenda/interfaces/agenda-response.interface';
// import { MeetingResponse } from 'src/app/meetings/interfaces/meeting-response.interface';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';

@Injectable({
  providedIn: 'root',
})
export class TypesOfMeetingsService {
  private readonly _serverUrl = `${baseUrl}/types-of-meetings`;
  private _http = inject(HttpClient);
  private _state = signal({
    typesOfMeetings: new Map<number, TypeOfMeeting>(),
  });
  private _notificatorService = inject(NotificatorService);

  constructor() {}

  getAllFormated(): TypeOfMeeting[] {
    return Array.from(this._state().typesOfMeetings.values());
  }

  getAll() {
    this._http.get<TypeOfMeetingResponse>(this._serverUrl).subscribe({
      next: (resp: TypeOfMeetingResponse) => {
        const typesOfMeetings: TypeOfMeeting[] = resp.data as TypeOfMeeting[];
        of(typesOfMeetings).subscribe((result) => {
          result.forEach((typeOfMeeting) => {
            this._state().typesOfMeetings.set(typeOfMeeting.id, typeOfMeeting);
          });
          this._state.set({ typesOfMeetings: this._state().typesOfMeetings });
        });
      },
      error: (error) => {
        this._notificatorService.notificate({
          severity: 'error',
          summary: 'ERROR',
          detail: error.message,
        });
      },
    });
  }

  getAllFrom(id: number): Observable<TypeOfMeeting[] | []> {
    return this._http
      .get<TypeOfMeetingResponse>(`${this._serverUrl}/organization/${id}`)
      .pipe(
        switchMap((resp: TypeOfMeetingResponse) => {
          return of(resp.data as TypeOfMeeting[]);
        }),
        catchError((err: HttpErrorResponse) => {
          this._notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.message,
          });
          return of([]);
        })
      );
  }

  getById(id: string): Observable<TypeOfMeeting | undefined> {
    let typeOfMeeting = this._state().typesOfMeetings.get(Number(id));

    if (!typeOfMeeting) {
      this._http
        .get<TypeOfMeetingResponse>(`${this._serverUrl}/${id}`)
        .subscribe({
          next: (resp: TypeOfMeetingResponse) => {
            typeOfMeeting = resp.data as TypeOfMeeting;
            this._state().typesOfMeetings.set(typeOfMeeting.id, typeOfMeeting);
            this._state.set({ typesOfMeetings: this._state().typesOfMeetings });
          },
          error: (error) => {
            this._notificatorService.notificate({
              severity: 'error',
              summary: 'ERROR',
              detail: error.message,
            });
          },
        });
    }

    return new Observable<TypeOfMeeting | undefined>((observer) => {
      observer.next(typeOfMeeting);
      observer.complete();
    });
  }
  // getById(id: string): TypeOfMeeting|null {
  //   const typeOfMeeting = this._state().typesOfMeetings.get(Number(id));
  //   if (!typeOfMeeting) {
  //     this._http.get<TypeOfMeetingResponse>(`${this._serverUrl}/${id}`).subscribe({
  //       next: (resp: TypeOfMeetingResponse) => {
  //         const typeOfMeeting: TypeOfMeeting = resp.data as TypeOfMeeting;
  //         this._state().typesOfMeetings.set(typeOfMeeting.id, typeOfMeeting);
  //         this._state.set({ typesOfMeetings: this._state().typesOfMeetings });
  //       },
  //       error: (error) => {
  //         this._notificatorService.notificate({
  //           severity: 'error',
  //           summary: 'ERROR',
  //           detail: error.message,
  //         });
  //       },
  //     });
  //   }
  //   return typeOfMeeting;
  // }
  //   return this.http.get<ToMResponse>(`${this._serverUrl}/${id}`).pipe(
  //     catchError((err: HttpErrorResponse) => {
  //       return of(err.error);
  //     })
  //   );
  // }

  // getAgendas(id: string): Observable<AgendaResponse> {
  //   return this.http
  //     .get<AgendaResponse>(`${this._serverUrl}/${id}/agendas`)
  //     .pipe(
  //       catchError((err: HttpErrorResponse) => {
  //         return of(err.error);
  //       })
  //     );
  // }

  // add(typeOfMeeting: TypeOfMeeting): Observable<ToMResponse> {
  //   return this.http
  //     .post<ToMResponse>(`${this._serverUrl}`, typeOfMeeting)
  //     .pipe(
  //       catchError((err: HttpErrorResponse) => {
  //         return of(err.error);
  //       })
  //     );
  // }

  // update(typeOfMeeting: TypeOfMeeting): Observable<ToMResponse> {
  //   return this.http
  //     .patch<ToMResponse>(
  //       `${this._serverUrl}/${typeOfMeeting.id}`,
  //       typeOfMeeting
  //     )
  //     .pipe(
  //       catchError((err: HttpErrorResponse) => {
  //         return of(err.error);
  //       })
  //     );
  // }

  // remove(typeOfMeeting: TypeOfMeeting): Observable<ToMResponse> {
  //   return this.http
  //     .patch<ToMResponse>(
  //       `${this._serverUrl}/remove/${typeOfMeeting.id}`,
  //       typeOfMeeting
  //     )
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }

  // getMeetings(id: string): Observable<MeetingResponse> {
  //   return this.http
  //     .get<MeetingResponse>(`${this._serverUrl}/${id}/meetings`)
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }
}
