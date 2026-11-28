import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, RenderMode, ServerRoute, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { PAGE_PATHS } from './routing/pages';

/** Every page in both languages is written out as its own HTML file at build time; there is no server in production. */
const serverRoutes: ServerRoute[] = [
  ...PAGE_PATHS.map((path): ServerRoute => ({ path, renderMode: RenderMode.Prerender })),
  { path: '**', renderMode: RenderMode.Client }
];

export const serverConfig: ApplicationConfig = mergeApplicationConfig(appConfig, {
  providers: [provideServerRendering(withRoutes(serverRoutes))]
});
