import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputIconModule } from 'primeng/inputicon';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './auth/services/auth.service';
import { NotificatorService } from './services/notificator.service';
import { DataService } from './shared/services/data.service';
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
    AvatarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'fvxmya';
  private readonly notificatorService: NotificatorService =
    inject(NotificatorService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly dataService = inject(DataService);

  panelVisible = signal<boolean>(false);
  isAuthenticated = computed(() => this.authService.getAuthStatus());
  username = computed(() => this.authService.getCurrentUserUsername());
  letter = computed(() => {
    if (this.username()) {
      return this.username()!.charAt(0).toUpperCase();
    }

    return '?';
  });

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

    if (this.authService.isLeader()) {
      this.dataService.loadData();
    }
  }

  ngOnInit(): void {}
}
