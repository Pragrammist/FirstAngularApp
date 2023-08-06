import { Inject, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { UserRegister } from './userRegister';
import { UserRegisterResponse } from './UserRegisterResponse';




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
    
    registerUser(user : UserRegister)
    {
        let res = this.http.post<UserRegisterResponse>(this.url, user);
        
        return res;
    }
    
}
