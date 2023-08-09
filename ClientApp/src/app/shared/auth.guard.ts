import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserCookieService } from 'src/app/core/user/user-cookie.service';


export const authGuard =  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ) => {
    const userCookieService = inject(UserCookieService);
    const router = inject(Router);
    
    if(userCookieService.isAuthorized())
        return true;
    
    let firstChildOfroute = route.firstChild?.url.toString();
    
    let parentOfRoute = route.url.toString();
    
    let pathToRedirect : string | undefined = undefined;
    
    pathToRedirect = "/" + parentOfRoute! + "/"+ firstChildOfroute!;

    let path = router.parseUrl('/authorize');

    

    
    path.queryParams["redirectTo"] = state.url;

    return path;
}
