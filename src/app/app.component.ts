import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputIconModule } from 'primeng/inputicon';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './auth/services/auth.service';
import { NotificatorService } from './services/notificator.service';
import { SidemenuComponent } from './sidemenu/sidemenu.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastModule,
    SidemenuComponent,
    ButtonModule,
    CardModule,
    MenubarModule,
    InputIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'fvxmya';
  private readonly notificatorService: NotificatorService =
    inject(NotificatorService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService = inject(AuthService);

  panelVisible = signal<boolean>(false);
  isAuthenticated = computed(() => this.authService.getAuthStatus());

  items: MenuItem[] = [
    {
      icon: 'pi pi-bars',
      command: () => this.panelVisible.set(true),
    },
  ];

  constructor() {
    effect(() => {
      const notification = this.notificatorService.getNotification();

      if (notification) {
        this.messageService.add(notification);
        this.notificatorService.clearNotification();
      }
    });

    this.authService.loadCurrentUser();

    // effect(() => {
    //   this._organizationsService.getAllFormatted();

    //   this.loadMenu();
    // });
  }

  ngOnInit(): void {}
}
