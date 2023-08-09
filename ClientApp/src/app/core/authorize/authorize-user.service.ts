import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { UserLoginModel } from "./models/user-login.model";
import { AuthorizeUserResponseModel } from "./models/authorize-user-response.model";
import { DISABLE_BASE_URL } from "../http/interceptors/set-default-url.interceptor";

//сервис отвечает за инкапсулирование логики
//формирования http запроса
@Injectable()
export class AuthorizeUserService{
    private url = "/user/login";
    constructor(private http: HttpClient) {}
    authorize(userLoginModel: UserLoginModel){
        let httpCl = this.http.disableBearerToken();
        return httpCl.post<AuthorizeUserResponseModel>(this.url, userLoginModel);
    }
}

