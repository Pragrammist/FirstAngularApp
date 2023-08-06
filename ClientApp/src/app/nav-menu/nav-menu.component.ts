import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../UserService';



@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent  implements OnInit {
  userLogin : string | undefined = undefined;
  
  constructor(private userService: UserService) {}

  //уже было, не знаю что это
  isExpanded = false;
  //уже было, не знаю что это
  collapse() {
    this.isExpanded = false;
  }
  //уже было, не знаю что это
  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  //нужно чтобы можно было отслеживать изменения логина
  //и если он изменится(логаут или отправится запрос на сервер чтобы его поменять),
  //то nav-menu сможет динамически логин у себя поменть
  //и отобразить пользователю
  //изнально планировалось использовать @Input() и @Output()
  //с событиями от дочерних элементов
  //и связываениме переменных между дочерним и родительским элементом
  //но потом понял что того что у меня стоит роутинг в проекте
  //это невозможно да и неудобно
  ngOnInit() {
    this.userService.subscribeToLogin(userLogin => {
      this.userLogin = userLogin;
    });
  }

  //метод событие, которые повешено на клик на сообщение приветсвтия
  //на "Привет,Login!"
  helloMessageLogout()
  {
    this.userService.logoutAndSendEvent();
  }
}
