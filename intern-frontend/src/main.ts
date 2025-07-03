import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideZoneChangeDetection} from '@angular/core';

import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {MessageService} from 'primeng/api';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {preset: Aura, options: {darkModeSelector: 'none'}},
      ripple: true
    }),
    provideHttpClient(),
    provideRouter(routes),
    provideZoneChangeDetection({
      eventCoalescing: true
    }),
    MessageService
  ]
});
