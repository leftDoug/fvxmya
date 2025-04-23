import { NgIf } from '@angular/common';
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
import { RouterLink } from '@angular/router';
import { OrganizationsService } from '@app/organizations/services/organizations.service';
import { TypesOfMeetingsService } from '@app/types-of-meetings/services/types-of-meetings.service';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidemenu',
  imports: [NgIf, ButtonModule, DrawerModule, PanelMenuModule, RouterLink],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidemenuComponent implements OnInit {
  private _organizationsService = inject(OrganizationsService);
  private _tomsService = inject(TypesOfMeetingsService);
  private organizations = computed(() =>
    this._organizationsService.getAllFormatted()
  );
  private toms = computed(() => this._tomsService.getAllFormated());

  visible = input.required<boolean>();
  onVisibleChange = output<boolean>();
  protected items = signal<MenuItem[]>([]);

  constructor() {
    effect(() => {
      this._organizationsService.getAllFormatted();

      this.loadMenu();
    });
  }

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu() {
    const tempItems: MenuItem[] = [
      {
        label: 'Organizaciones',
        icon: 'pi pi-chart-bar',
        items: this.organizations().map((organization) => ({
          label: organization.name,
          route: `/organizaciones/${organization.id}`,
        })),
      },
      {
        label: 'Tipos de Reuniones',
        icon: 'pi pi-chart-bar',
        items: this.organizations().map((organization) => ({
          label: organization.name,
          route: `organizaciones/typos-de-reuniones/${organization.id}`,
        })),
      },
      {
        label: 'Reuniones',
        icon: 'pi pi-chart-bar',
        items: this.organizations().map((organization) => ({
          label: organization.name,
          items: this.toms().map((tom) => ({
            label: tom.name,
            route: `organizaciones/tipos-de-reuniones/reuniones/${tom.id}`,
          })),
        })),
      },
      {
        label: 'Perfil',
        icon: 'pi pi-home',
        items: [
          {
            label: 'Cambiar contraseña',
            icon: 'pi pi-chart-bar',
            route: '/perfil/gestionar',
          },
          {
            label: 'Cerrar sesión',
            icon: 'pi pi-chart-bar',
            command: () => {
              console.log('Log out');
            },
          },
        ],
      },
    ];

    this.items.set(tempItems);
  }

  changeVisible(newVisible: boolean) {
    this.onVisibleChange.emit(newVisible);
  }
}
