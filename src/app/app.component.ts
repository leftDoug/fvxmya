import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NotificatorService } from './services/notificator.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'fvxmya';
  private readonly notificatorService: NotificatorService =
    inject(NotificatorService);
  private readonly messageService: MessageService = inject(MessageService);

  // panelVisible = signal<boolean>(false);

  constructor() {
    effect(() => {
      const notification = this.notificatorService.getNotification();

      if (notification) {
        this.messageService.add(notification);
        this.notificatorService.clearNotification();
      }
    });

    // effect(() => {
    //   this._organizationsService.getAllFormatted();

    //   this.loadMenu();
    // });
  }

  ngOnInit(): void {}
}
