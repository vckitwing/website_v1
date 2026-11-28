import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SiteContentService } from './shared/content/site-content.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // the pages are built as HTML ahead of time; the browser takes that HTML over instead of drawing it again
    provideClientHydration(withIncrementalHydration()),
    // Waits (at most a couple of seconds) for the published History / Conferences before the page renders.
    provideAppInitializer(() => inject(SiteContentService).load())
  ]
};
