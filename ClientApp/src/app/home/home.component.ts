import { Component } from '@angular/core';
import { ChangeUserDataModel } from './ChangeUserDataModel';
import { ChangeUserDataService } from './ChangeDataUserService';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ChangeUserDataResponse } from './ChangeUserDataResponse';
import { UserService } from '../UserService';
import { Router } from '@angular/router';
// import { ValidateEmail, ValidateLogin, ValidatePassword } from '../userRegularExps';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers:[ChangeUserDataService]
})
export class HomeComponent{
  currentLogin : string | undefined = undefined;
  currentEmail: string | undefined = undefined;
  //модель данных которая привязана к инпутам
  //данная модель отправляется на сервер
  newUserData: ChangeUserDataModel = {newPassword : undefined, newEmail : undefined,  newLogin: undefined, currentPassword : undefined};

  errorMessage : string | undefined;

  isBadRequest = false;
  //сообщение с сервера
  changeDataMessage : Observable<string> | undefined = undefined;

  //переменная нужна
  //чтобы можно было переключать
  //отображение данных
  //и отображение полей для их изменения
  showLogin = false;
  constructor(private changeUserDataService:ChangeUserDataService, private currentUserService : UserService, router: Router)
  {
    //чтобы реагировать на изменения логина и почты
    currentUserService.subscribeToUserData((login, email) => {
      this.currentEmail = email;
      this.currentLogin = login;
    });
    //если если произойдет событие логаута
    //то тогда он будет верунт к авторизации
    currentUserService.subscribeToLogout(()=>{
      router.navigateByUrl("authorize");
    });

  }
  
  //переключения режима отображения
  //этот метод обрабывает двойное нажатие на главный контенер текущего шаблона
  showOrHideLoginInfo()
  {
    this.showLogin = !this.showLogin;
  }
  
  isNewUserDataModelValid()
  {
    //хотябы одно из полей заполнено
    // и пользователь ввел пароль
    return (
      (
        this.newUserData.newEmail !== undefined  ||
        this.newUserData.newLogin !== undefined  || 
        this.newUserData.newPassword !== undefined 
      ) &&
      this.newUserData.currentPassword !== undefined);
  }
  //обрабочтик на кнопку изменений данных пользователя
  SendDataToChange()
  {
    //таже нужно давать новое значение переменным 
    //чтобы метод можно было вызывать несколько раз
    this.errorMessage = undefined;
    this.isBadRequest = false;
    this.changeDataMessage = undefined;
    //валидация данных из модели
    if(!this.isNewUserDataModelValid())
    {
      this.errorMessage = "Нет текущего пароля и введенных новых данных";
      return;
    }

    //вызов метода из сервиса, которые делает put запрос на изменение данных
    //по итого получается итоговое сообщение с сервера
    this.changeDataMessage = this.changeUserDataService.changeUserData(this.newUserData).pipe(
      tap((changeDataRes : ChangeUserDataResponse) => {
        //если обшика делать здесь нечего
        if(changeDataRes.isError)
          return;
        //вызов логики повторной авторизации
        //чтобы обновить куки и таймер
        this.currentUserService.authorizeAndSendEvent(changeDataRes.token as string, changeDataRes.newUser?.login as string, changeDataRes.newUser?.email as string);
      }),
      //чтобы по итогу получить сообщение сервера
      //нужен маппинг
      map((changeDataRes : ChangeUserDataResponse) => changeDataRes.message), 
      catchError(val => {
        //записываем что это ошибка
        this.isBadRequest = true;
        let message = (val.error as ChangeUserDataResponse).message;
        this.errorMessage = message;           
        return of(message)})
    );
  }
}


