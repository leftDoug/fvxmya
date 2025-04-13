import { Routes } from '@angular/router';

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
        title: 'Informacion',
        loadComponent: () =>
          import(
            './organizations/pages/organization-info/organization-info.component'
          ).then((c) => c.OrganizationInfoComponent),
      },
    ],
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
