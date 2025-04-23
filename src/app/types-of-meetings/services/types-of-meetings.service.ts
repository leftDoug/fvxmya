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
import {
  Agenda,
  AgendaResponse,
} from '@app/agendas/interfaces/agenda.interface';

@Injectable({
  providedIn: 'root',
})
export class TypesOfMeetingsService {
  private readonly serverUrl = `${baseUrl}/types-of-meetings`;
  private readonly notificatorService = inject(NotificatorService);
  private readonly http = inject(HttpClient);
  private state = signal({
    typesOfMeetings: new Map<number, TypeOfMeeting>(),
  });

  constructor() {}

  getAllFormated(): TypeOfMeeting[] {
    return Array.from(this.state().typesOfMeetings.values());
  }

  getAll() {
    this.http.get<TypeOfMeetingResponse>(this.serverUrl).subscribe({
      next: (resp: TypeOfMeetingResponse) => {
        const typesOfMeetings: TypeOfMeeting[] = resp.data as TypeOfMeeting[];
        of(typesOfMeetings).subscribe((result) => {
          result.forEach((typeOfMeeting) => {
            this.state().typesOfMeetings.set(typeOfMeeting.id, typeOfMeeting);
          });
          this.state.set({ typesOfMeetings: this.state().typesOfMeetings });
        });
      },
      error: (error) => {
        this.notificatorService.notificate({
          severity: 'error',
          summary: 'ERROR',
          detail: error.message,
        });
      },
    });
  }

  getAllFrom(id: number): Observable<TypeOfMeeting[] | []> {
    return this.http
      .get<TypeOfMeetingResponse>(`${this.serverUrl}/organization/${id}`)
      .pipe(
        switchMap((resp: TypeOfMeetingResponse) => {
          return of(resp.data as TypeOfMeeting[]);
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

  getById(id: string): Observable<TypeOfMeeting | undefined> {
    let typeOfMeeting = this.state().typesOfMeetings.get(Number(id));

    if (!typeOfMeeting) {
      this.http
        .get<TypeOfMeetingResponse>(`${this.serverUrl}/${id}`)
        .subscribe({
          next: (resp: TypeOfMeetingResponse) => {
            typeOfMeeting = resp.data as TypeOfMeeting;
            this.state().typesOfMeetings.set(typeOfMeeting.id, typeOfMeeting);
            this.state.set({ typesOfMeetings: this.state().typesOfMeetings });
          },
          error: (error) => {
            this.notificatorService.notificate({
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

  getInfo(id: number): Observable<TypeOfMeeting | undefined> {
    return this.http
      .get<TypeOfMeetingResponse>(`${this.serverUrl}/info/${id}`)
      .pipe(
        switchMap((resp: TypeOfMeetingResponse) => {
          return of(resp.data as TypeOfMeeting);
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

  remove(id: number): void {
    this.http
      .delete<TypeOfMeetingResponse>(`${this.serverUrl}/remove/${id}`)
      .subscribe({
        next: (resp: TypeOfMeetingResponse) => {
          this.notificatorService.notificate({
            severity: 'info',
            summary: 'INFO',
            detail: resp.message,
          });
          this.state().typesOfMeetings.delete(id);
          this.state.set({ typesOfMeetings: this.state().typesOfMeetings });
        },
        error: (err: HttpErrorResponse) => {
          console.error(err.error.message);
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });
          return of(false);
        },
      });
  }

  // getById(id: string): TypeOfMeeting|null {
  //   const typeOfMeeting = this.state().typesOfMeetings.get(Number(id));
  //   if (!typeOfMeeting) {
  //     this.http.get<TypeOfMeetingResponse>(`${this.serverUrl}/${id}`).subscribe({
  //       next: (resp: TypeOfMeetingResponse) => {
  //         const typeOfMeeting: TypeOfMeeting = resp.data as TypeOfMeeting;
  //         this.state().typesOfMeetings.set(typeOfMeeting.id, typeOfMeeting);
  //         this.state.set({ typesOfMeetings: this.state().typesOfMeetings });
  //       },
  //       error: (error) => {
  //         this.notificatorService.notificate({
  //           severity: 'error',
  //           summary: 'ERROR',
  //           detail: error.message,
  //         });
  //       },
  //     });
  //   }
  //   return typeOfMeeting;
  // }
  //   return this.http.get<ToMResponse>(`${this.serverUrl}/${id}`).pipe(
  //     catchError((err: HttpErrorResponse) => {
  //       return of(err.error);
  //     })
  //   );
  // }

  getAgendas(id: number): Observable<Agenda[]> {
    return this.http
      .get<AgendaResponse>(`${this.serverUrl}/agendas/${id}`)
      .pipe(
        switchMap((resp: AgendaResponse) => of(resp.data as Agenda[])),
        catchError((err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });
          return of([]);
        })
      );
  }

  // add(typeOfMeeting: TypeOfMeeting): Observable<ToMResponse> {
  //   return this.http
  //     .post<ToMResponse>(`${this.serverUrl}`, typeOfMeeting)
  //     .pipe(
  //       catchError((err: HttpErrorResponse) => {
  //         return of(err.error);
  //       })
  //     );
  // }

  // update(typeOfMeeting: TypeOfMeeting): Observable<ToMResponse> {
  //   return this.http
  //     .patch<ToMResponse>(
  //       `${this.serverUrl}/${typeOfMeeting.id}`,
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
  //       `${this.serverUrl}/remove/${typeOfMeeting.id}`,
  //       typeOfMeeting
  //     )
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }

  // getMeetings(id: string): Observable<MeetingResponse> {
  //   return this.http
  //     .get<MeetingResponse>(`${this.serverUrl}/${id}/meetings`)
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }
}
