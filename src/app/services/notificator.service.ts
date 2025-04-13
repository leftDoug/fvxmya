import { Injectable, signal } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificatorService {
  private notification = signal<ToastMessageOptions | null>(null);

  constructor() {}

  notificate(notification: ToastMessageOptions) {
    this.notification.set(notification);
  }

  getNotification(): ToastMessageOptions | null {
    return this.notification();
  }

  clearNotification() {
    this.notification.set(null);
  }
}
