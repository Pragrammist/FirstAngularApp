import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { UserLoginModel } from "./models/user-login.model";
import { AuthorizeUserResponseModel } from "./models/authorize-user-response.model";

//сервис отвечает за инкапсулирование логики
//формирования http запроса
@Injectable()
export class AuthorizeUserService{
    private url = "";
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string)
    {
        this.url = baseUrl + "user/login/"
    }

    authorize(userLoginModel: UserLoginModel){
        return this.http.post<AuthorizeUserResponseModel>(this.url, userLoginModel);
    }
}

