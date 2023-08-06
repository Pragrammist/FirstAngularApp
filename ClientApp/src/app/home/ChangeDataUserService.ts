import { Inject, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ChangeUserDataModel } from './ChangeUserDataModel';
import { UserCookieService } from '../userCookieService';
import { ChangeUserDataResponse } from './ChangeUserDataResponse';


//сервис чтобы инкапсулировать вызов метода http
//которые меняет данные пользователя

@Injectable()
export class ChangeUserDataService
{
    private url;
    constructor(private http: HttpClient, private cookieService : UserCookieService, @Inject('BASE_URL') baseUrl: string){
        this.url = baseUrl + "user/";
    }

    changeUserData(userData : ChangeUserDataModel)
    {
        return this.http.put<ChangeUserDataResponse>(this.url, userData, {
            headers:{
                //авторизация по токену
                "Authorization": "Bearer " + this.cookieService.getJwtToken(),
                "Content-type": "application/json",
                "Accept" : "application/json"
            }
        });
    }
}
