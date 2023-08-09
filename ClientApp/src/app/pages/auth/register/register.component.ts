import { Component } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/user/user.service';
import { UserRegisterService } from 'src/app/core/register/userRegisterService';
import { UserRegisterResponseModel } from 'src/app/core/register/models/user-register-response.model';
import { UserRegisterModel } from 'src/app/core/register/models/user-register.model';





@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserRegisterService]
})
export class RegisterComponent {
  
  //модель пользователя которая отсылается на бэк
  //данная модель инициализирется
  //через inupt(ы) в темплейте
  userToRegist : UserRegisterModel = new UserRegisterModel();
  errorMessage : string | undefined = undefined;
  //сообщение с сервера зарегался пользователь или нет
  registerUserFromServerResult : Observable<string> | undefined = undefined;
  isBadRequest : boolean = false;
  
  

  constructor(private userRegisterService: UserRegisterService, private currentUserService : UserService, private router: Router) { }
  
  isUserDataValid()
  {
    //поля должны быть все заполнены
    //пароли должны совпадать
    return this.userToRegist.email !== undefined 
    && this.userToRegist.login !== undefined 
    && this.userToRegist.password2 !== undefined 
    && this.userToRegist.password !== undefined 
    && this.userToRegist.password === this.userToRegist.password2
  }

  sendUserToRegist() {
    //данная инициализация в начале нужна чтобы
    //это метод можно было вызват несколькот раз
    //и все работало правильно
    this.isBadRequest = false;
    this.errorMessage = undefined;

    //проверка на валидность
    if(!this.isUserDataValid()
    ){
      this.errorMessage = "Поля не должны быть пустыми и пароли должны быть одинаковыми ";
      return;
    }
    
    


    
    
    
    this.registerUserFromServerResult = this.userRegisterService
      .registerUser(this.userToRegist)//вызов метод рестрации из сервиса
      .pipe(
        tap((regRes : UserRegisterResponseModel) => {
           // если ошибка то делать здесь нечего
          if(regRes.isError)
            return;
          
            //regRes.token может содерэать null
            //но здесь это не возможно
            // так как нету ошибки с сервера
            let token = regRes.token as string;
            //вызов логики авторизации
            this.currentUserService.authorizeAndSendEvent(token, this.userToRegist.login as string, this.userToRegist.email as string);
            
        }),
        //чтобы можно было показать сообщение с сервера
        //нужно его смапить
        map( (regRes : UserRegisterResponseModel) => regRes.message),
        catchError(val => {
          //сообщение с сервера
          let message = (val.error as UserRegisterResponseModel).message;
          this.errorMessage = message;   
          this.isBadRequest = true;
          return of(message)})
      );
      
    
    
    
  }
  
}

