import { Injectable, NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';




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
        return this.cookieService.check("token") && this.cookieService.check("login") && this.cookieService.check("email");  
    }
    public getLogin() : string
    {
        return this.cookieService.get("login");
    }
    public getJwtToken()
    {
        return this.cookieService.get("token");
    }
    public authorize(login: string, token: string, email : string)
    {
        //в этом классе авторизация лишь подразумевает запись в куки ключей значений
        this.cookieService.set("token", token);
        this.cookieService.set("login",login);
        this.cookieService.set("email", email);
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