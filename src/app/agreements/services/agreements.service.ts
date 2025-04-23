import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';
import { catchError, Observable, of } from 'rxjs';
import { Agreement, AgreementResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AgreementsService {
  private readonly http = inject(HttpClient);
  private readonly notificatorService = inject(NotificatorService);
  private readonly serverUrl: string = `${baseUrl}/agreements`;
  private state = signal({ agreements: new Map<number, Agreement>() });

  constructor() {}

  getAllFormatted(): Agreement[] {
    return Array.from(this.state().agreements.values());
  }

  getAllFromUser(): Observable<AgreementResponse> {
    return this.http
      .get<AgreementResponse>(`${this.serverUrl}`, {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('fvx_m&a_token')!,
        }),
      })
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getAllFromMeeting(id: number) {
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

  getAll(): Observable<AgreementResponse> {
    return this.http
      .get<AgreementResponse>(`${this.serverUrl}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  getById(id: string): Observable<AgreementResponse> {
    return this.http
      .get<AgreementResponse>(`${this.serverUrl}/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

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

  getResponses(id: string): Observable<AgreementResponse> {
    return this.http
      .get<AgreementResponse>(`${this.serverUrl}/responses/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  add(agreement: Agreement): Observable<AgreementResponse> {
    return this.http
      .post<AgreementResponse>(`${this.serverUrl}`, agreement)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  addResponse(response: {
    idAgreement: string;
    content: string;
  }): Observable<AgreementResponse> {
    return this.http
      .post<AgreementResponse>(`${this.serverUrl}/responses`, response)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  update(agreement: Agreement): Observable<AgreementResponse> {
    return this.http
      .patch<AgreementResponse>(`${this.serverUrl}/${agreement.id}`, {
        compilanceDate: agreement.compilanceDate,
      })
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }

  setCompleted(id: string): Observable<AgreementResponse> {
    return this.http
      .patch<AgreementResponse>(`${this.serverUrl}/complete/${id}`, null)
      .pipe(catchError((err: HttpErrorResponse) => of(err.error)));
  }
}
