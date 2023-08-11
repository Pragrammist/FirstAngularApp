import { Inject, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ChangeUserDataModel } from './models/change-user-data.model';
import { ChangeUserDataResponseModel } from './models/change-user-data-response.model';
import { UserCookieService } from 'src/app/core/user/user-cookie.service';


//сервис чтобы инкапсулировать вызов метода http
//которые меняет данные пользователя

@Injectable()
export class ChangeUserDataService
{
    private url = "/user";
    constructor(private http: HttpClient){}

    changeUserData(userData : ChangeUserDataModel)
    {
        return this.http.put<ChangeUserDataResponseModel>(this.url, userData);
    }
}
