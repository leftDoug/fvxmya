import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { adminGuard } from './shared/guards/admin.guard';
import { authGuard } from './shared/guards/auth.guard';
import { leaderGuard } from './shared/guards/leader.guard';
import { loginGuard } from './shared/guards/login.guard';

export const routes: Routes = [
  {
    path: 'organizaciones',
    children: [
      {
        path: '',
        title: 'Organizaciones',
        canActivate: [authGuard, leaderGuard],
        loadComponent: () =>
          import(
            './organizations/pages/organizations-table/organizations-table.component'
          ).then((c) => c.OrganizationsTableComponent),
      },
      {
        path: 'detalles/:id',
        title: 'Detalles de la Organización',
        canActivate: [authGuard, leaderGuard],
        loadComponent: () =>
          import(
            './organizations/pages/organization-info/organization-info.component'
          ).then((c) => c.OrganizationInfoComponent),
      },
      // {
      //   path: 'tipo-de-reunion/reuniones/:id',
      //   title: 'Reuniones',
      //   loadComponent: () =>
      //     import(
      //       './types-of-meetings/pages/type-of-meeting-info/type-of-meeting-info.component'
      //     ).then((c) => c.TypeOfMeetingInfoComponent),
      // },
      // {
      //   path: 'tipo-de-reunion/agendas/:id',
      //   title: 'Agendas',
      //   loadComponent: () =>
      //     import(
      //       './types-of-meetings/pages/type-of-meeting-info/type-of-meeting-info.component'
      //     ).then((c) => c.TypeOfMeetingInfoComponent),
      // },
    ],
  },
  {
    path: 'reuniones',
    children: [
      {
        path: 'tipo-reunion/:id',
        title: 'Reuniones',
        canActivate: [authGuard, leaderGuard],
        loadComponent: () =>
          import(
            './types-of-meetings/pages/type-of-meeting-info/type-of-meeting-info.component'
          ).then((c) => c.TypeOfMeetingInfoComponent),
      },
      {
        path: 'detalles/:id',
        title: 'Detalles de la Reunión',
        canActivate: [authGuard, leaderGuard],
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
        path: 'tipo-reunion/:id',
        title: 'Agendas',
        canActivate: [authGuard, leaderGuard],
        loadComponent: () =>
          import(
            './types-of-meetings/pages/type-of-meeting-info/type-of-meeting-info.component'
          ).then((c) => c.TypeOfMeetingInfoComponent),
      },
      {
        path: 'detalles/:id',
        title: 'Detalles de la Agenda',
        canActivate: [authGuard, leaderGuard],
        loadComponent: () =>
          import('./agendas/pages/agenda-form/agenda-form.component').then(
            (c) => c.AgendaFormComponent
          ),
      },
      {
        path: 'agregar/:id',
        title: 'Agregar Agenda',
        canActivate: [authGuard, leaderGuard],
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
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./auth/pages/admin-table/admin-table.component').then(
            (c) => c.AdminTableComponent
          ),
      },
    ],
  },
  {
    path: 'acuerdos',
    children: [
      {
        path: '',
        title: 'Acuerdos del Usuario',
        canActivate: [authGuard],
        loadComponent: () =>
          import(
            './agreements/pages/agreements-page/agreements-page.component'
          ).then((c) => c.AgreementsPageComponent),
      },
      {
        path: 'reunion/:id',
        canActivate: [authGuard, leaderGuard],
        title: 'Acuerdos de la Reunión',
        loadComponent: () =>
          import('./meetings/pages/meeting-info/meeting-info.component').then(
            (c) => c.MeetingInfoComponent
          ),
      },
      {
        path: 'general',
        canActivate: [authGuard, leaderGuard],
        title: 'Acuerdos',
        loadComponent: () =>
          import(
            './agreements/pages/agreements-page/agreements-page.component'
          ).then((c) => c.AgreementsPageComponent),
      },
    ],
  },
  {
    path: 'iniciar-sesion',
    title: 'Inicio de Sesión',
    canActivate: [loginGuard],
    component: LoginComponent,
  },
  {
    path: 'acceso-denegado',
    title: 'Acceso denegado',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./access-denied/access-denied.component').then(
        (c) => c.AccessDeniedComponent
      ),
  },
  {
    path: '',
    redirectTo: 'iniciar-sesion',
    pathMatch: 'full',
  },
  // {
  //   path: '**',
  //   redirectTo: 'iniciar-sesion',
  // },
];
