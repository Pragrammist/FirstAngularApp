import { Inject, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { UserRegisterModel } from './models/user-register.model';
import { UserRegisterResponseModel } from './models/user-register-response.model';





//сервис инкапсулирует вызов метод http
//логику формирования путей
//по которому вызываеются методы сервера
@Injectable()
export class UserRegisterService 
{
    private url;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string)
    {
        this.url = baseUrl + "user/";
    }
    
    registerUser(user : UserRegisterModel)
    {
        let res = this.http.post<UserRegisterResponseModel>(this.url, user);
        
        return res;
    }
    
}
