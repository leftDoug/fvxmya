import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { baseUrl } from '@app/environment/environment.development';
import { NotificatorService } from '@app/services/notificator.service';
import {
  catchError,
  lastValueFrom,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Meeting, MeetingResponse } from '../interfaces/meeting.interface';

export type MeetingState = {
  data: Meeting | undefined;
  loading: boolean;
  error: any | null;
};

@Injectable({
  providedIn: 'root',
})
export class MeetsService {
  private readonly http = inject(HttpClient);
  private readonly serverUrl = baseUrl + '/meetings';
  private readonly notificatorService = inject(NotificatorService);
  private meetings = signal<Map<number, Meeting>>(new Map());
  private loadingStates = signal<Map<number, boolean>>(new Map());
  private errorStates = signal<Map<number, any>>(new Map());
  private pendingRequests = new Map<number, Promise<MeetingResponse>>();
  private loadedToms = signal<Set<number>>(new Set());

  constructor() {}

  // getMeeting(id:number):Meeting|undefined{
  //   const currentMeetings=this.meetings()

  //   if(currentMeetings.has(id)){
  //     return currentMeetings.get(id)
  //   }

  //   if(!this.pendingRequests.has(id)){
  //     this.fetchMeeting(id)
  //   }

  //   return undefined
  // }

  getAllFormatted(): Signal<Meeting[]> {
    return computed(() => Array.from(this.meetings().values()));
  }

  getAllFrom(id: number): void {
    if (!this.loadedToms().has(id)) {
      // console.log('not requested');
      this.http
        .get<MeetingResponse>(`${this.serverUrl}/type-of-meeting/${id}`)
        .subscribe({
          next: (result) => {
            // console.log(result);
            const meets: Meeting[] = result.data as Meeting[];

            this.meetings.update((meetings) => {
              const newMap = new Map(meetings);

              meets.forEach((m) => newMap.set(m.id, m));

              return newMap;
            });
            this.loadedToms.update((toms) => new Set(toms.add(id)));
          },
          error: (err: HttpErrorResponse) => {
            // console.log(err);
            this.notificatorService.notificate({
              severity: 'error',
              summary: 'ERROR',
              detail: err.error.message,
            });
            return throwError(() => new Error(err.error));
          },
        });
    } else {
      // console.log('already requested');
    }
  }

  getMeetingState(id: number): Signal<MeetingState> {
    const currentMeetings = this.meetings();

    if (!currentMeetings.has(id) && !this.pendingRequests.has(id)) {
      this.fetchMeeting(id);
    }

    return computed<MeetingState>(() => ({
      data: this.meetings().get(id),
      loading: this.loadingStates().has(id),
      error: this.errorStates().get(id) || null,
    }));
  }

  // getMeetingState(id:number){
  //   return computed<MeetingState>(()=>({
  //     data:this.meetings().get(id),
  //     loading:this.loadingStates().has(id),
  //     error:this.errorStates().get(id)||null
  //   }))
  // }

  update(meet: Meeting): Observable<boolean> {
    this.setLoading(meet.id, true);
    return this.http
      .patch<MeetingResponse>(`${this.serverUrl}/${meet.id}`, meet)
      .pipe(
        switchMap((result) => {
          this.handleSuccess(meet.id, result.data as Meeting);
          this.notificatorService.notificate({
            severity: 'success',
            summary: 'ACTUALIZADO',
            detail: result.message,
          });
          this.setLoading(meet.id, false);
          return of(true);
        }),
        catchError((err: HttpErrorResponse) => {
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: err.error.message,
          });
          this.setLoading(meet.id, false);
          return of(false);
        })
      );
  }

  private async fetchMeeting(id: number) {
    this.clearError(id), this.setLoading(id, true);

    try {
      const request = this.http
        .get<MeetingResponse>(`${this.serverUrl}/${id}`)
        .pipe(
          tap((result) => this.handleSuccess(id, result.data as Meeting)),
          catchError((err: HttpErrorResponse) => {
            this.handleError(id, err);
            return throwError(() => new Error(err.error));
          })
        );
      const meetingPromise = lastValueFrom(request);

      this.pendingRequests.set(id, meetingPromise);

      await meetingPromise;
    } finally {
      this.setLoading(id, false);
      this.pendingRequests.delete(id);
    }
  }

  private handleSuccess(id: number, meeting: Meeting) {
    this.updateMeetingSignal(id, meeting);
    this.clearError(id);
  }

  private handleError(id: number, error: HttpErrorResponse) {
    this.errorStates.update((errors) => {
      const newMap = new Map(errors);
      newMap.set(id, error.error);
      return newMap;
    });
    this.notificatorService.notificate({
      severity: 'error',
      summary: 'ERROR',
      detail: error.error.message,
    });
    throw error.error;
  }

  private updateMeetingSignal(id: number, meeting: Meeting) {
    this.meetings.update((currentMeetings) => {
      return new Map(currentMeetings).set(id, meeting);
    });
  }

  private setLoading(id: number, isLoading: boolean) {
    this.loadingStates.update((states) => {
      const newMap = new Map(states);

      if (isLoading) {
        newMap.set(id, true);
      } else {
        newMap.delete(id);
      }
      return newMap;
    });
  }

  private clearError(id: number) {
    this.errorStates.update((errors) => {
      const newMap = new Map(errors);
      newMap.delete(id);
      return newMap;
    });
  }
}
