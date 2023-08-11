import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpContextToken
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { UserCookieService } from '../../user/user-cookie.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class BearerTokenInterceptor implements HttpInterceptor {

  

  constructor(private userCookieService: UserCookieService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isDisabled = req.context.get(DISABLE_BEARER_TOKEN);

    if(!this.userCookieService.isAuthorized() || isDisabled)    
      return next.handle(req);

    const token = this.userCookieService.getAccessToken();
    
    const reqClone = req.clone({
      setHeaders: {"Authorization": "Bearer " + token} 
    });
    
    return next.handle(reqClone);
    
  }
}

export const DISABLE_BEARER_TOKEN = new HttpContextToken(() => false);


