import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';
import { Topic, TopicResponse } from '@app/topics/interfaces/topic.interface';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { Agenda, AgendaResponse } from '../interfaces/agenda.interface';

@Injectable({
  providedIn: 'root',
})
export class AgendasService {
  private readonly serverUrl: string = `${baseUrl}/agendas`;
  private readonly notificatorService = inject(NotificatorService);
  private readonly http = inject(HttpClient);
  private state = signal({
    agendas: new Map<number, Agenda>(),
  });
  private tomsRequested: number[] = [];

  getAllFormatted(): Agenda[] {
    return Array.from(this.state().agendas.values());
  }

  getAllFrom(id: number): void {
    if (!this.tomsRequested.includes(id)) {
      this.http
        .get<AgendaResponse>(`${this.serverUrl}/type-of-meeting/${id}`)
        .subscribe({
          next: (resp: AgendaResponse) => {
            const agendas = resp.data as Agenda[];
            of(agendas).subscribe((result) => {
              result.forEach((a) => {
                this.state().agendas.set(a.id, a);
              });
              this.state.set({ agendas: this.state().agendas });
            });
            this.tomsRequested.push(id);
          },
          error: (err: HttpErrorResponse) => {
            console.error(err.error.message);
            this.notificatorService.notificate({
              severity: 'error',
              summary: 'ERROR',
              detail: err.error.message,
            });
          },
        });
    }
  }

  getTopicsFrom(idTom: number, year: number): Observable<Topic[]> {
    const agenda = this.getAllFormatted().find(
      (a) => a.typeOfMeeting?.id === idTom && a.year === year
    );

    if (agenda) {
      return of(agenda.topics as Topic[]);
    } else {
      let params = new HttpParams();
      params = params.append('year', year);
      return this.http
        .get<TopicResponse>(`${this.serverUrl}/topics/${idTom}`, { params })
        .pipe(
          switchMap((resp: TopicResponse) => of(resp.data as Topic[])),
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
  }

  getInfo(id: number): Observable<Agenda | undefined> {
    const agenda = this.state().agendas.get(id);

    if (agenda) {
      return of(agenda);
    } else {
      return this.http.get<AgendaResponse>(`${this.serverUrl}/info/${id}`).pipe(
        switchMap((resp: AgendaResponse) => {
          const a: Agenda = resp.data as Agenda;
          this.state().agendas.set(a.id, a);
          this.state.set({ agendas: this.state().agendas });
          return of(a);
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
  }

  add(agenda: Agenda): Observable<boolean> {
    return this.http.post<AgendaResponse>(`${this.serverUrl}`, agenda).pipe(
      switchMap((resp: AgendaResponse) => {
        const a: Agenda = resp.data as Agenda;
        this.state().agendas.set(a.id, a);
        this.state.set({ agendas: this.state().agendas });
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

  update(agenda: Agenda): Observable<boolean> {
    return this.http
      .patch<AgendaResponse>(`${this.serverUrl}/${agenda.id}`, agenda)
      .pipe(
        switchMap((resp: AgendaResponse) => {
          const a: Agenda = resp.data as Agenda;
          this.state().agendas.set(a.id, a);
          this.state.set({ agendas: this.state().agendas });
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

  remove(id: number) {
    return this.http
      .delete<AgendaResponse>(`${this.serverUrl}/${id}`)
      .subscribe({
        next: (resp: AgendaResponse) => {
          this.notificatorService.notificate({
            severity: 'info',
            summary: 'ELIMINADO',
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
