import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';
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
    // if (!this.tomsRequested.includes(id)) {
    this.http
      .get<AgendaResponse>(`${this.serverUrl}/type-meeting/${id}`)
      .subscribe({
        next: (resp) => {
          const ages = resp.data as Agenda[];

          of(ages).subscribe((result) => {
            result.forEach((age) => {
              this.state().agendas.set(age.id, age);
            });

            this.state.set({ agendas: this.state().agendas });
          });

          // this.tomsRequested.push(id);
        },
      });
    // }
  }

  // TODO probar este
  getFromTomAndYear(
    idTom: number,
    year: number
  ): Observable<Agenda | undefined> {
    const agenda = this.getAllFormatted().find(
      (a) => a.typeOfMeeting?.id === idTom && a.year === year
    );

    if (agenda) {
      return of(agenda);
    } else {
      let params = new HttpParams();
      params = params.append('year', year);

      return this.http
        .get<AgendaResponse>(
          `${this.serverUrl}/type-meeting-and-year/${idTom}`,
          { params }
        )
        .pipe(
          switchMap((resp) => {
            const age: Agenda = resp.data as Agenda;

            this.state().agendas.set(age.id, age);
            this.state.set({ agendas: this.state().agendas });

            return of(age);
          }),
          catchError(() => of(undefined))
        );
    }
  }

  getById(id: number): Observable<Agenda | undefined> {
    const agenda = this.state().agendas.get(id);

    if (agenda) {
      return of(agenda);
    } else {
      return this.http.get<AgendaResponse>(`${this.serverUrl}/${id}`).pipe(
        switchMap((resp: AgendaResponse) => {
          const a: Agenda = resp.data as Agenda;
          this.state().agendas.set(a.id, a);
          this.state.set({ agendas: this.state().agendas });
          return of(a);
        }),
        catchError(() => of(undefined))
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
      catchError((err: HttpErrorResponse) => of(false))
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
        catchError(() => of(false))
      );
  }

  remove(id: number): void {
    this.http.delete<AgendaResponse>(`${this.serverUrl}/${id}`).subscribe({
      next: (resp: AgendaResponse) => {
        this.state().agendas.delete(id);
        this.state.set({ agendas: this.state().agendas });
        this.notificatorService.notificate({
          severity: 'info',
          summary: 'ELIMINADO',
          detail: resp.message,
        });
      },
    });
  }
}
