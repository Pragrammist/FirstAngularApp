import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BearerTokenInterceptor } from './interceptors/bearer-token.interceptor';
import { SetDefaultUrlInterceptor } from './interceptors/set-default-url.interceptor';



/** Http interceptor providers in outside-in order */
// export const httpInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: SetDefaultUrlInterceptor, multi: true },
//   { provide: HTTP_INTERCEPTORS, useClass: BearerTokenInterceptor, multi: true },
// ];