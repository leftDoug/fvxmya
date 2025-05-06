import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import MyPreset from './primeng-red-theme';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { tokenInterceptor } from './shared/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([tokenInterceptor, errorInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: MyPreset,
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: false,
        },
      },
      translation: {
        emptyFilterMessage: 'No hay resultados',
        emptyMessage: 'No hay datos',
        monthNames: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        monthNamesShort: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],
        dayNamesMin: ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'],
      },
    }),
  ],
};
