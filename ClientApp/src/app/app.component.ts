import { Component, Inject } from '@angular/core';
import { UserCookieService } from './userCookieService';
import { UserService } from './UserService';
import { timer } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  
  constructor(currentUserService : UserService, userCookieService : UserCookieService)
  {
    //проверка по кукам на на наличие авторизации
    if(userCookieService.isAuthorized()) 
    {
      //проверка на валидность токена запросом в бэк
      currentUserService.checkCurrentToken(tokenIsValid => {
        //проверка валидности токена
        //как только загрузился главынй компонент
        if(tokenIsValid)
        { 
          //вызывает событие, куда передаются данные пользователя.
          //другие компноненты смогут через метод subsrcibe получить данные пользователя
          //данное событие вызывается в корневом элементе
          //чтобы за раз проинцеализировать в компонентах данные пользователя
          currentUserService.setAllUserDataAsEvent(
            userCookieService.getLogin(), 
            userCookieService.getEmail(), 
            userCookieService.getJwtToken()
          );
          //зупуск таймера после которого произойдет логует
          //время таймера равняется тому, какого время у токена
          //хотя можно поставить и другое время в конфигурации
          currentUserService.logoutWhenTokenExpired();
        }
        else
          //если токен уже не валидный то происходит выход из аккаунта
          //чтобы пользователь ввел заново пароль 
          //и обновил токен
          currentUserService.logoutAndSendEvent();
      });
    }
      
    
    
    
  }
  
  
}
