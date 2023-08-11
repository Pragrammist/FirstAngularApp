import { Component } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/user/user.service';
import { AuthorizeUserService } from 'src/app/core/authorize/authorize-user.service';
import { UserLoginModel } from 'src/app/core/authorize/models/user-login.model';
import { AuthorizeUserResponseModel } from 'src/app/core/authorize/models/authorize-user-response.model';

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
      tap((loginRes : AuthorizeUserResponseModel) => {
        if(loginRes.isError)
          return;
        //loginRes.token as string, loginRes.user?.login as string, loginRes.user?.email as string
        this.currentUserService.authorizeAndSendEvent( {
          email : loginRes.user?.email as string,
          login: loginRes.user?.login as string,
          token: loginRes.token as string,
          refreshToken: loginRes.refreshToken as string,
        } );
        
      }),
      map((logRes : AuthorizeUserResponseModel) => logRes.message),
      catchError(val => {
        let message = (val.error as AuthorizeUserResponseModel).message;
        this.errorMessage = message;           
        this.isBadRequest = true;
        return of(message)})
    );
  }
}
