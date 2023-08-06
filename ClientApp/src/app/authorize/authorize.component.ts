import { Component } from '@angular/core';
import { UserLoginModel } from './UserLoginModel';
import { AuthorizeUserService } from './authorizeUserService';
import { AuthorizeUserResponse } from "./AuthorizeUserResponse";
import { Observable, catchError, map, of, tap } from 'rxjs';
import { UserService } from '../UserService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.css'],
  providers: [AuthorizeUserService]
})
export class AuthorizeComponent {
  //все как было раньше только по другому переменные называются
  loginUserModel : UserLoginModel = {loginOrEmail: undefined, password : undefined};
  errorMessage : string | undefined = undefined;
  authorizeMessage : Observable<string> | undefined = undefined;
  isBadRequest = false;
  constructor(private authoRizeService: AuthorizeUserService, private currentUserService : UserService, private router: Router){}

  isUserDataValid()
  {
    //все поля должны быть заполены
    return this.loginUserModel.loginOrEmail !== undefined && this.loginUserModel.password !== undefined
  }
  
  sendAuthorize()
  {
    //чтобы метод можно было вызывать понесколько раз
    this.errorMessage = undefined;
    this.isBadRequest = false;
    if(!this.isUserDataValid())
    {
      this.errorMessage = "Поля должный быть заполнены!";
      return;
    }
      
    //сохраниние сообщения с сервера
    this.authorizeMessage = this.authoRizeService
    //использовавание сервиса
    //где инкапсуллюрована логина
    //вызоыва http запроса
    .authorize(this.loginUserModel)
    .pipe(
      tap((loginRes : AuthorizeUserResponse) => {
        if(loginRes.isError)
          return;
        
        this.currentUserService.authorizeAndSendEvent(loginRes.token as string, loginRes.user?.login as string, loginRes.user?.email as string);
        this.router.navigateByUrl("");
      }),
      map((logRes : AuthorizeUserResponse) => logRes.message),
      catchError(val => {
        let message = (val.error as AuthorizeUserResponse).message;
        this.errorMessage = message;           
        this.isBadRequest = true;
        return of(message)})
    );
  }
}
