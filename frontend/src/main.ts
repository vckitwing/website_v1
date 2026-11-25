import { inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { SiteContentService } from './app/shared/content/site-content.service';

bootstrapApplication(AppComponent, {
  // Waits (at most a couple of seconds) for the published History / Conferences before the page renders.
  providers: [provideAppInitializer(() => inject(SiteContentService).load())]
}).catch((error: unknown) => console.error(error));
