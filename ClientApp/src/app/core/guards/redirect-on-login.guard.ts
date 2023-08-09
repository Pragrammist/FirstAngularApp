import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../user/user.service';



export const redirectOnLogin =  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ) => {

    const currentUserService = inject(UserService);
    const router = inject(Router);

    
    //если если произойдет событие логаута
    //то тогда он будет верунт к авторизации
    currentUserService.subscribeToLogIn(()=>{
        let urlToRedirect = route.queryParams["redirectTo"] as string | undefined;

        if(urlToRedirect !== undefined)
            router.navigateByUrl(urlToRedirect);
        else
            router.navigateByUrl("/main");
    });
    return true;
}