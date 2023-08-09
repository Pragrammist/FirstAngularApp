import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpContextToken
} from '@angular/common/http';

import { Observable } from 'rxjs';


/** Pass untouched request through to the next request handler. */
@Injectable()
export class SetDefaultUrlInterceptor implements HttpInterceptor {
  constructor(@Inject('BASE_URL') private baseUrl: string){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isDisabled = req.context.get(DISABLE_BASE_URL);
    
    let regExprIsAbs = new RegExp('^(?:[a-z+]+:)+', 'i');
    
    if(regExprIsAbs.test(req.url)  || isDisabled)
      return next.handle(req);

    const reqClone = req.clone({
        url: this.baseUrl + req.url
    });
    
    return next.handle(reqClone);
    
  }
}

export const DISABLE_BASE_URL = new HttpContextToken(() => false);