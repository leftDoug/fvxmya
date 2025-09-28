import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { RegisterComponent } from '@app/auth/pages/register/register.component';
import { AuthService } from '@app/auth/services/auth.service';
import { MeetingsService } from '@app/meetings/services/meetings.service';
import { OrganizationsService } from '@app/organizations/services/organizations.service';
import { TypesOfMeetingsService } from '@app/types-of-meetings/services/types-of-meetings.service';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidemenu',
  imports: [ButtonModule, DrawerModule, PanelMenuModule, RegisterComponent],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidemenuComponent implements OnInit {
  private readonly organizationsService = inject(OrganizationsService);
  private readonly tomsService = inject(TypesOfMeetingsService);
  private readonly meetingsService = inject(MeetingsService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private organizations = computed(() => {
    if (this.authService.isLeader()) {
      return this.organizationsService
        .getAllFormatted()
        .filter(
          (org) => org.leader?.id === this.authService.getCurrentUserId()
        );
    }

    return [];
  });
  private toms = computed(() => {
    if (this.authService.isLeader() && this.organizations().length > 0) {
      return this.tomsService
        .getAllFormatted()
        .filter((tom) =>
          this.organizations().some((org) => org.id === tom.organization?.id)
        );
    }

    return [];
  });
  private meetings = computed(() => {
    if (this.authService.isLeader() && this.toms().length > 0) {
      return this.meetingsService
        .getAllFormatted()
        .filter((meet) =>
          this.toms().some((tom) => tom.id === meet.typeOfMeeting?.id)
        );
    }

    return [];
  });

  visible = input.required<boolean>();
  onVisibleChange = output<boolean>();
  items = signal<MenuItem[]>([]);

  formRegisterVisible: boolean = false;

  constructor() {
    effect(() => {
      this.organizationsService.getAllFormatted();
      this.tomsService.getAllFormatted();
      this.meetingsService.getAllFormatted();

      this.loadMenu();
    });
  }

  ngOnInit(): void {
    // this.loadMenu();
  }

  loadMenu() {
    let items: MenuItem[] = [];
    const leadOrgItems: MenuItem[] = [
      {
        label: 'Organizaciones',
        icon: 'pi pi-sitemap',
        command: () => {
          this.changeVisible(false);
          this.router.navigate(['organizaciones']);
        },
      },
    ];
    const leadMeetItems: MenuItem[] = [
      {
        label: 'Reuniones',
        icon: 'pi pi-briefcase',
        items: this.organizations().map((organization) => ({
          label: organization.name,
          items: this.toms().map((tom) => ({
            label: tom.name,
            command: () => {
              this.changeVisible(false);
              this.router.navigate(['reuniones/tipo-reunion', tom.id]);
            },
          })),
        })),
      },
    ];
    const leadAgeItems: MenuItem[] = [
      {
        label: 'Agendas',
        icon: 'pi pi-calendar-clock',
        items: this.organizations().map((organization) => ({
          label: organization.name,
          items: this.toms().map((tom) => ({
            label: tom.name,
            command: () => {
              this.changeVisible(false);
              this.router.navigate(['agendas/tipo-reunion', tom.id]);
            },
          })),
        })),
      },
    ];
    let leadAgrItems: MenuItem[] = [
      {
        label: 'Acuerdos',
        icon: 'pi pi-file',
        items: this.organizations().map((organization) => ({
          label: organization.name,
          items: this.toms().map((tom) => ({
            label: tom.name,
            items: this.meetings().map((meet) => ({
              label: meet.name,
              command: () => {
                this.changeVisible(false);
                this.router.navigate(['acuerdos/reunion', meet.id]);
              },
            })),
          })),
        })),
      },
    ];
    const profileItems: MenuItem[] = [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Cambiar contraseña',
            icon: 'pi pi-key',
            command: () => {
              this.changeVisible(false);
              this.showFormRegisterDialog();
            },
          },
          {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => {
              this.changeVisible(false);
              this.authService.logout();
            },
          },
        ],
      },
    ];

    if (this.authService.isAdmin()) {
      items = [
        {
          label: 'Usuarios',
          icon: 'pi pi-users',
          command: () => {
            this.changeVisible(false);
            this.router.navigate(['usuarios']);
          },
        },
        ...leadOrgItems,
      ];
    }

    if (this.authService.isLeader()) {
      items = [
        ...items,
        ...leadOrgItems,
        ...leadMeetItems,
        ...leadAgeItems,
        {
          label: 'Todos los Acuerdos',
          icon: 'pi pi-list',
          command: () => {
            this.changeVisible(false);
            this.router.navigate(['acuerdos/general']);
          },
        },
        ...leadAgrItems,
      ];
    }

    items = [
      ...items,
      {
        label: 'Acuerdos del Usuario',
        icon: 'pi pi-list',
        command: () => {
          this.changeVisible(false);
          this.router.navigate(['acuerdos']);
        },
      },
      ...profileItems,
    ];

    this.items.set(items);

    // const tempItems: MenuItem[] = [
    //   {
    //     label: 'Usuarios',
    //     icon: 'pi pi-chart-bar',
    //     command: () => this.router.navigate(['usuarios']),
    //   },
    //   {
    //     label: 'Organizaciones',
    //     icon: 'pi pi-chart-bar',
    //     command: () => this.router.navigate(['organizaciones']),
    //   },
    //   // {
    //   //   label: 'Organizaciones',
    //   //   icon: 'pi pi-chart-bar',
    //   //   items: this.organizations().map((organization) => ({
    //   //     label: organization.name,
    //   //     route: `/organizaciones/${organization.id}`,
    //   //   })),
    //   // },
    //   {
    //     label: 'Tipos de Reuniones',
    //     icon: 'pi pi-chart-bar',
    //     items: this.organizations().map((organization) => ({
    //       label: organization.name,
    //       route: `organizaciones/typos-de-reuniones/${organization.id}`,
    //     })),
    //   },
    //   {
    //     label: 'Reuniones',
    //     icon: 'pi pi-chart-bar',
    //     items: this.organizations().map((organization) => ({
    //       label: organization.name,
    //       items: this.toms().map((tom) => ({
    //         label: tom.name,
    //         route: `organizaciones/tipos-de-reuniones/reuniones/${tom.id}`,
    //       })),
    //     })),
    //   },
    //   {
    //     label: 'Perfil',
    //     icon: 'pi pi-home',
    //     items: [
    //       {
    //         label: 'Cambiar contraseña',
    //         icon: 'pi pi-chart-bar',
    //         route: '/perfil/gestionar',
    //         command: () => this.showFormRegisterDialog(),
    //       },
    //       {
    //         label: 'Cerrar sesión',
    //         icon: 'pi pi-chart-bar',
    //         command: () => this.authService.logout(),
    //       },
    //     ],
    //   },
    // ];

    // this.items.set(tempItems);
  }

  changeVisible(newVisible: boolean) {
    this.onVisibleChange.emit(newVisible);
  }

  showFormRegisterDialog() {
    this.formRegisterVisible = true;
  }

  hideFormRegisterDialog() {
    this.formRegisterVisible = false;
  }
}
