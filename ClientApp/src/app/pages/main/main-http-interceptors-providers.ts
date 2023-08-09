import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JsonAcceptContentTypeInterceptor } from "src/app/core/http/interceptors/json-accept-content-type.interceptor";


/** Http interceptor providers in outside-in order */
export const mainHttpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: JsonAcceptContentTypeInterceptor, multi: true },
  ];