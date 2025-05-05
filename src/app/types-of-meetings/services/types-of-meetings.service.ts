import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
// import { environment } from 'src/environments/environment.development';
import { catchError, Observable, of, switchMap } from 'rxjs';
import {
  TypeOfMeeting,
  TypeOfMeetingCreate,
  TypeOfMeetingResponse,
} from '../interfaces/type-of-meeting.interface';
// import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
// import { AgendaResponse } from 'src/app/agenda/interfaces/agenda-response.interface';
// import { MeetingResponse } from 'src/app/meetings/interfaces/meeting-response.interface';
import {
  Agenda,
  AgendaResponse,
} from '@app/agendas/interfaces/agenda.interface';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';

@Injectable({
  providedIn: 'root',
})
export class TypesOfMeetingsService {
  private readonly serverUrl = `${baseUrl}/types-meetings`;
  private readonly notificatorService = inject(NotificatorService);
  private readonly http = inject(HttpClient);
  private state = signal({
    typesOfMeetings: new Map<number, TypeOfMeeting>(),
  });

  constructor() {}

  getAllFormatted(): TypeOfMeeting[] {
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

  getAllFrom(id: number): void {
    this.http
      .get<TypeOfMeetingResponse>(`${this.serverUrl}/organization/${id}`)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          const toms: TypeOfMeeting[] = resp.data as TypeOfMeeting[];

          of(toms).subscribe((result) => {
            result.forEach((tom) => {
              this.state().typesOfMeetings.set(tom.id, tom);
            });

            this.state.set({ typesOfMeetings: this.state().typesOfMeetings });
          });
        },
      });
  }

  // getById(id: string): Observable<TypeOfMeeting | undefined> {
  //   let typeOfMeeting = this.state().typesOfMeetings.get(Number(id));

  //   if (!typeOfMeeting) {
  //     this.http
  //       .get<TypeOfMeetingResponse>(`${this.serverUrl}/${id}`)
  //       .subscribe({
  //         next: (resp: TypeOfMeetingResponse) => {
  //           typeOfMeeting = resp.data as TypeOfMeeting;
  //           this.state().typesOfMeetings.set(typeOfMeeting.id, typeOfMeeting);
  //           this.state.set({ typesOfMeetings: this.state().typesOfMeetings });
  //         },
  //         error: (error) => {
  //           this.notificatorService.notificate({
  //             severity: 'error',
  //             summary: 'ERROR',
  //             detail: error.message,
  //           });
  //         },
  //       });
  //   }

  //   return new Observable<TypeOfMeeting | undefined>((observer) => {
  //     observer.next(typeOfMeeting);
  //     observer.complete();
  //   });
  // }

  getById(id: number): Observable<TypeOfMeeting | undefined> {
    return this.http.get<TypeOfMeetingResponse>(`${this.serverUrl}/${id}`).pipe(
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

  create(tom: TypeOfMeetingCreate): Observable<boolean> {
    return this.http.post<TypeOfMeetingResponse>(this.serverUrl, tom).pipe(
      switchMap((resp) => {
        const tom: TypeOfMeeting = resp.data as TypeOfMeeting;

        this.state().typesOfMeetings.set(tom.id, tom);
        this.state.set({ typesOfMeetings: this.state().typesOfMeetings });
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
