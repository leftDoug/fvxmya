import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { NotificatorService } from '@app/services/notificator.service';
import { catchError, Observable, of, switchMap } from 'rxjs';
import {
  Organization,
  OrganizationResponse,
} from '../interfaces/organization.interface';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  private readonly http = inject(HttpClient);
  private readonly notificatorService = inject(NotificatorService);
  private readonly apiUrl = 'http://localhost:4000/api/organizations';
  private state = signal({ organizations: new Map<number, Organization>() });

  constructor() {}

  getAllFormatted(): Organization[] {
    return Array.from(this.state().organizations.values());
  }

  // getAllSignal(): void {
  //   this.http.get<OrganizationResponse>(this.apiUrl).subscribe({
  //     next: (resp: OrganizationResponse) => {
  //       const organizations = resp.data as Organization[];
  //       of(organizations).subscribe((result) => {
  //         result.forEach((org) => {
  //           this.state().organizations.set(org.id, org);
  //         });
  //         this.state.set({ organizations: this.state().organizations });
  //       });
  //     },
  //     // error: (err: HttpErrorResponse) => {
  //     //   console.error(err.error.message);
  //     //   this.notificatorService.notificate({
  //     //     severity: 'error',
  //     //     summary: 'ERROR',
  //     //     detail: err.error.message,
  //     //   });
  //     // },
  //   });
  // }

  getAllFrom(): void {
    this.http.get<OrganizationResponse>(`${this.apiUrl}/leader`).subscribe({
      next: (resp: OrganizationResponse) => {
        const organizations = resp.data as Organization[];

        of(organizations).subscribe((result) => {
          result.forEach((org) => {
            this.state().organizations.set(org.id, org);
          });

          this.state.set({ organizations: this.state().organizations });
        });
      },
    });
  }

  getById(id: number): Observable<Organization | undefined> {
    return this.http.get<OrganizationResponse>(`${this.apiUrl}/${id}`).pipe(
      switchMap((resp: OrganizationResponse) => {
        const org: Organization = resp.data as Organization;

        this.state().organizations.set(org.id, org);
        this.state.set({ organizations: this.state().organizations });

        return of(org);
      }),
      catchError(() => of(undefined))
    );
  }

  add(organization: Organization): Observable<boolean> {
    return this.http
      .post<OrganizationResponse>(`${this.apiUrl}`, organization)
      .pipe(
        switchMap((resp) => {
          const organization: Organization = resp.data as Organization;

          this.state().organizations.set(organization.id, organization);
          this.state.set({ organizations: this.state().organizations });

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ÉXITO',
            detail: resp.message,
          });

          return of(true);
        }),
        catchError(() => of(false))
      );
  }

  update(organization: Organization): Observable<boolean> {
    return this.http
      .patch<OrganizationResponse>(
        `${this.apiUrl}/${organization.id}`,
        organization
      )
      .pipe(
        switchMap((resp) => {
          const organization: Organization = resp.data as Organization;

          this.state().organizations.set(organization.id, organization);
          this.state.set({ organizations: this.state().organizations });

          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ÉXITO',
            detail: resp.message,
          });

          return of(true);
        }),
        catchError(() => of(false))
      );
  }

  remove(id: number): void {
    this.http
      .delete<OrganizationResponse>(`${this.apiUrl}/remove/${id}`)
      .subscribe({
        next: (resp: OrganizationResponse) => {
          this.notificatorService.notificate({
            severity: 'info',
            summary: 'INFO',
            detail: resp.message,
          });

          this.state().organizations.delete(id);
          this.state.set({ organizations: this.state().organizations });
        },
      });
  }
}
