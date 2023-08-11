import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpContextToken
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { UserCookieService } from '../../user/user-cookie.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class JsonAcceptContentTypeInterceptor implements HttpInterceptor {
  constructor(){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isDisabled = req.context.get(DISABLE_JSON_ACEPT_CONTENT_TYPE);
    if(isDisabled)    
      return next.handle(req);
    
    const reqClone = req.clone({
      setHeaders: {"Content-type": "application/json",
                    "Accept" : "application/json"} 
    });
    
    return next.handle(reqClone);
    
  }
}

export const DISABLE_JSON_ACEPT_CONTENT_TYPE = new HttpContextToken(() => false);