import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideZoneChangeDetection} from '@angular/core';

import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideZoneChangeDetection({
      eventCoalescing: true
    })
  ]
});
