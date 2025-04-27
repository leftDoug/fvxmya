import { Routes } from '@angular/router';
import { PruebaComponent } from './prueba/prueba.component';

export const routes: Routes = [
  {
    path: 'organizaciones',
    children: [
      {
        path: '',
        title: 'Organizaciones',
        loadComponent: () =>
          import(
            './organizations/pages/organizations-table/organizations-table.component'
          ).then((c) => c.OrganizationsTableComponent),
      },
      {
        path: 'info/:id',
        title: 'Informacion de la Organización',
        loadComponent: () =>
          import(
            './organizations/pages/organization-info/organization-info.component'
          ).then((c) => c.OrganizationInfoComponent),
      },
      {
        path: 'tipo-de-reunion/reuniones/:id',
        title: 'Reuniones',
        loadComponent: () =>
          import(
            './types-of-meetings/pages/type-of-meeting-info/type-of-meeting-info.component'
          ).then((c) => c.TypeOfMeetingInfoComponent),
      },
      {
        path: 'tipo-de-reunion/agendas/:id',
        title: 'Agendas',
        loadComponent: () =>
          import(
            './types-of-meetings/pages/type-of-meeting-info/type-of-meeting-info.component'
          ).then((c) => c.TypeOfMeetingInfoComponent),
      },
    ],
  },
  {
    path: 'reuniones',
    children: [
      {
        path: '',
        title: 'Reuniones',
        loadComponent: () =>
          import(
            './meetings/pages/meetings-table/meetings-table.component'
          ).then((c) => c.MeetingsTableComponent),
      },
      {
        path: 'info/:id',
        title: 'Informacion de la Reunión',
        loadComponent: () =>
          import('./meetings/pages/meeting-info/meeting-info.component').then(
            (c) => c.MeetingInfoComponent
          ),
      },
    ],
  },
  {
    path: 'agendas',
    children: [
      {
        path: '',
        title: 'Agendas',
        loadComponent: () =>
          import('./agendas/pages/agendas-table/agendas-table.component').then(
            (c) => c.AgendasTableComponent
          ),
      },
      {
        path: ':id',
        title: 'Agendas',
        loadComponent: () =>
          import(
            './types-of-meetings/pages/type-of-meeting-info/type-of-meeting-info.component'
          ).then((c) => c.TypeOfMeetingInfoComponent),
      },
      {
        path: 'info/:id',
        title: 'Informacion de la Agenda',
        loadComponent: () =>
          import('./agendas/pages/agenda-form/agenda-form.component').then(
            (c) => c.AgendaFormComponent
          ),
      },
      {
        path: 'agregar/:id',
        title: 'Crear Agenda',
        loadComponent: () =>
          import('./agendas/pages/agenda-form/agenda-form.component').then(
            (c) => c.AgendaFormComponent
          ),
      },
    ],
  },
  {
    path: 'usuarios',
    children: [
      {
        path: '',
        title: 'Usuarios',
        loadComponent: () =>
          import('./auth/pages/admin-table/admin-table.component').then(
            (c) => c.AdminTableComponent
          ),
      },
    ],
  },
  {
    path: 'prueba',
    component: PruebaComponent,
  },
  {
    path: '',
    redirectTo: '/organizaciones',
    pathMatch: 'full',
  },
  // {
  //   path: '**',
  //   component: OrganizationsTableComponent,
  // },
];
