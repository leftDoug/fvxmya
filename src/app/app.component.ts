import {
  Component,
  computed,
  effect,
  inject,
  LOCALE_ID,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputIconModule } from 'primeng/inputicon';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PopoverModule } from 'primeng/popover';
import { ToastModule } from 'primeng/toast';
import { RegisterComponent } from './auth/pages/register/register.component';
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
    PopoverModule,
    MenuModule,
    RegisterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
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

  itemsUser: MenuItem[] = [];
  formRegisterVisible: boolean = false;

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

  ngOnInit(): void {
    this.itemsUser = [
      {
        label: this.username(),
        items: [
          {
            label: 'Cambiar contraseña',
            icon: 'pi pi-cog',
            command: () => this.showFormRegisterDialog(),
          },
          {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: () => this.authService.logout(),
          },
        ],
      },
    ];
  }

  showFormRegisterDialog() {
    this.formRegisterVisible = true;
  }

  hideFormRegisterDialog() {
    this.formRegisterVisible = false;
  }
}
