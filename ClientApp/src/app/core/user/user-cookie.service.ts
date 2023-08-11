import { Injectable, NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthorizeUserInCookie } from './models/authorize-user-in-cookie.model';
import { UserTokensModel } from './models/user-tokens.model';




//глобавльный сервис для работы с куками пользователя
@Injectable()
export class UserCookieService
{
    constructor(private cookieService: CookieService)
    {

    }
    
    public isAuthorized()
    {
        //по наличию в куках сразу трех "ключей" - 
        //это token, login и email,
        //определяется авторизирован пользователь или нет
        return this.cookieService.check("token") && this.cookieService.check("login") && this.cookieService.check("email") && this.cookieService.check("refreshToken");  
    }

    public updateTokens(tokens: UserTokensModel)
    {
        this.cookieService.set("token", tokens.token);
        this.cookieService.set("refreshToken", tokens.token)
    }
    public getLogin() : string
    {
        return this.cookieService.get("login");
    }
    public getAccessToken()
    {
        return this.cookieService.get("token");
    }
    public getRefreshToken()
    {
        return this.cookieService.get("refreshToken");
    }
    public authorize(user : AuthorizeUserInCookie)
    {
        //в этом классе авторизация лишь подразумевает запись в куки ключей значений
        this.cookieService.set("token", user.token);
        this.cookieService.set("login",user.login);
        this.cookieService.set("email", user.email);
        this.cookieService.set("refreshToken", user.refreshToken)
    }
    public getEmail()
    {
        return this.cookieService.get("email");
    }
    public clearAllUsersCookie()
    {
        //нужен для логаута.
        //этот метод при логауте не используется в компонентах
        //этот метод используется в UserService
        this.cookieService.deleteAll();
    }
}