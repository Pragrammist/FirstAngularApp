
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../core/user/user.service';


export const redirectOnLogout =  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ) => {
    const currentUserService = inject(UserService);
    const router = inject(Router);

    //если если произойдет событие логаута
    //то тогда он будет верунт к авторизации
    currentUserService.subscribeToLogout(()=>{
        router.navigateByUrl("authorize");
    });
    return true;
}