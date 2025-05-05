import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { Agreement, AgreementResponse, AgreementState } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AgreementsService {
  private readonly http = inject(HttpClient);
  private readonly notificatorService = inject(NotificatorService);
  private readonly serverUrl: string = `${baseUrl}/agreements`;
  private state = signal({ agreements: new Map<string, Agreement>() });

  constructor() {}

  getAllFormatted(): Agreement[] {
    return Array.from(this.state().agreements.values());
  }

  getAllFromUser(): Observable<Agreement[]> {
    return this.http.get<AgreementResponse>(`${this.serverUrl}`).pipe(
      switchMap((resp) => {
        const agr: Agreement[] = resp.data as Agreement[];

        of(agr).subscribe((result) => {
          result.forEach((a) => {
            this.state().agreements.set(a.id, a);
          });

          this.state.set({ agreements: this.state().agreements });
        });

        return of(agr);
      }),
      catchError(() => of([]))
    );
  }

  getAllFromMeeting(id: number): void {
    this.http
      .get<AgreementResponse>(`${this.serverUrl}/meeting/${id}`)
      .subscribe({
        next: (resp: AgreementResponse) => {
          const agreements: Agreement[] = resp.data as Agreement[];
          of(agreements).subscribe((result) => {
            result.forEach((a) => {
              this.state().agreements.set(a.id, a);
            });
            this.state.set({ agreements: this.state().agreements });
          });
        },
      });
  }

  // TODO borrar
  // getAll(): Observable<AgreementResponse> {
  //   return this.http
  //     .get<AgreementResponse>(`${this.serverUrl}`)
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }

  // getById(id: string): Observable<AgreementResponse> {
  //   return this.http
  //     .get<AgreementResponse>(`${this.serverUrl}/${id}`)
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }

  // XXX arrglar las rutas para k tengan el id al final
  // getInfo(id: string): Observable<AgreementResponse> {
  //   this.loadingService.show();

  //   return this.http
  //     .get<AgreementResponse>(`${this.serverUrl}/info/${id}`)
  //     .pipe(
  //       catchError((err: HttpErrorResponse) => of(err.error)),
  //       finalize(() => this.loadingService.hide())
  //     );
  // }

  // getResponses(id: string): Observable<AgreementResponse> {
  //   return this.http
  //     .get<AgreementResponse>(`${this.serverUrl}/responses/${id}`)
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }

  getById(id: string): Signal<AgreementState> {
    const currentAgreements = this.state().agreements;

    if (!currentAgreements.has(id)) {
      this.http.get<AgreementResponse>(`${this.serverUrl}/${id}`).subscribe({
        next: (resp) => {
          const agr: Agreement = resp.data as Agreement;

          this.state().agreements.set(agr.id, agr);
          this.state.set({ agreements: this.state().agreements });
        },
      });
    }

    return computed<AgreementState>(() => ({
      loading: !this.state().agreements.has(id),
      data: this.state().agreements.get(id),
    }));
  }

  add(agreement: Agreement): Observable<boolean> {
    return this.http.post<AgreementResponse>(this.serverUrl, agreement).pipe(
      switchMap((resp) => {
        const a: Agreement = resp.data as Agreement;

        this.state().agreements.set(a.id, a);
        this.state.set({ agreements: this.state().agreements });

        this.notificatorService.notificate({
          severity: 'success',
          summary: 'AGREGADO',
          detail: resp.message,
        });

        return of(true);
      }),
      catchError(() => of(false))
    );
  }

  update(agr: Agreement): Observable<Agreement | undefined> {
    return this.http
      .patch<AgreementResponse>(`${this.serverUrl}/${agr.id}`, agr)
      .pipe(
        switchMap((resp) => {
          const agr: Agreement = resp.data as Agreement;

          this.state().agreements.set(agr.id, agr);
          this.state.set({ agreements: this.state().agreements });

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });

          return of(agr);
        }),
        catchError(() => of(undefined))
      );
  }

  // add(agreement: Agreement): Observable<AgreementResponse> {
  //   return this.http
  //     .post<AgreementResponse>(`${this.serverUrl}`, agreement)
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }

  addResponse(response: {
    idAgreement: string;
    content: string;
  }): Observable<Agreement | undefined> {
    return this.http
      .post<AgreementResponse>(`${baseUrl}/responses`, response)
      .pipe(
        switchMap((resp) => {
          const a: Agreement = resp.data as Agreement;

          this.state().agreements.set(a.id, a);
          this.state.set({ agreements: this.state().agreements });

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });

          return of(a);
        }),
        catchError(() => of(undefined))
      );
  }

  // update(agreement: Agreement): Observable<AgreementResponse> {
  //   return this.http
  //     .patch<AgreementResponse>(`${this.serverUrl}/${agreement.id}`, {
  //       compilanceDate: agreement.compilanceDate,
  //     })
  //     .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  // }

  complete(id: string): void {
    this.http
      .patch<AgreementResponse>(`${this.serverUrl}/complete/${id}`, null)
      .subscribe({
        next: (resp) => {
          const agr: Agreement = this.state().agreements.get(id)!;
          agr.completed = true;

          this.state().agreements.set(agr.id, agr);
          this.state.set({ agreements: this.state().agreements });

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: resp.message,
          });
        },
      });
  }

  cancel(id: string): void {
    this.http
      .patch<AgreementResponse>(`${this.serverUrl}/cancel/${id}`, null)
      .subscribe({
        next: (resp) => {
          const agr: Agreement = this.state().agreements.get(id)!;
          agr.state = false;

          this.state().agreements.set(agr.id, agr);
          this.state.set({ agreements: this.state().agreements });

          this.notificatorService.notificate({
            severity: 'info',
            summary: 'ANULADO',
            detail: resp.message,
          });
        },
      });
  }
}
