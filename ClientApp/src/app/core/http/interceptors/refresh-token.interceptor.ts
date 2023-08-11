import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http/";
import { BehaviorSubject, Observable, catchError, filter, map, of, switchMap, take, tap } from "rxjs";
import { UserService } from "../../user/user.service";
import { Injectable, Injector, inject } from "@angular/core";
import { UserCookieService } from "../../user/user-cookie.service";
import { UserTokensModel } from "../../user/models/user-tokens.model";




@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    
    private refreshTokenSubject = new BehaviorSubject<UserTokensModel | undefined>(undefined) ;
    private isRefreshing = false;
    constructor(private inj: Injector){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(catchError(error => {
        let response = error as HttpResponse<any>;
        
        if(response.status !== 401)
          return of(error);

        const userService  = this.inj.get(UserService); 
        if(this.isRefreshing)
          return this.refreshTokenSubject.pipe(
            filter(res => res !== undefined),
            map(res => res!),
            switchMap(res =>{
              
              return this.cloneRequestWithAuthorizationNext(req, next, res);
            })
          );

        
        this.isRefreshing = true;
        this.refreshTokenSubject.next(undefined);
        return userService.updateTokens().pipe(
          switchMap( res =>{                
              this.refreshTokenSubject.next(res);
              this.isRefreshing = false;
              return this.cloneRequestWithAuthorizationNext(req, next, res);
            }                
          )
        );

        
        
        
      }));
    }

    cloneRequestWithAuthorizationNext(req: HttpRequest<any>, next: HttpHandler, tokens: UserTokensModel)
    {
      let accessToken = tokens.token;
      let rettryRequest =req.clone({
        setHeaders:{
          "Authorization":"Bearer " + accessToken
        }
      });
      return next.handle(rettryRequest)
    }

  }
  