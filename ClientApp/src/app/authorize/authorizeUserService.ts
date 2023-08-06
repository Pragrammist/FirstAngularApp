import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { UserLoginModel } from "./UserLoginModel";
import { AuthorizeUserResponse } from "./AuthorizeUserResponse";

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
        return this.http.post<AuthorizeUserResponse>(this.url, userLoginModel);
    }
}

