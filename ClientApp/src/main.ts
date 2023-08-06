import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return "https://localhost:7128/";
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }, // ссылка на бэк
  { provide: 'USER_TOKEN_LIFE_TIME', useFactory: () => 1, deps:[]} // время жизни токена в минутах. Значение такое же как в бэеенде
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
