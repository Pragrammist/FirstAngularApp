import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, timer, zip } from 'rxjs';
import { UserCookieService } from './userCookieService';
import { HttpClient } from '@angular/common/http';


// главный сервис для работы с пользователями
@Injectable()
export class UserService{

    //через эту переменнцю отслеживается логин текущего пользователя
    //а также при смене логина или когда пользователь делает логаут
    private userLoginSub$ = new BehaviorSubject<string | undefined>(undefined);
    //используется subscribe на какие-либо изменения с логином
    private authorizedUserLogin = this.userLoginSub$.asObservable();

    //все анлогичное как выше
    private userEmailSub$ = new BehaviorSubject<string | undefined>(undefined);
    private authorizedUserEmail = this.userEmailSub$.asObservable();

    //все анлогичное как выше
    private userTokenSub$ = new BehaviorSubject<string | undefined>(undefined);
    private authorizedUserToken = this.userTokenSub$.asObservable();

    //используется для того чтобы
    //вызвать событие логаута
    private userLogout$ = new Subject();
    //используется чтобы отреагировать
    //на событие логаута через метод subscribe
    private userLogoutObs = this.userLogout$.asObservable();

    //аналогичен userLoginSub$, userEmailSub$, userTokenSub$ 
    //но сразу следит за изменениями трех переменных
    //а не отдельности
    private authorizedUserData;


    //путь к бэку где валидируется токен
    private validateTokenUrl : string;

    //таймер по которому происходит логаут
    private logOutTimer;
    //вреся в мс сколько пользователь авторизован
    private timeLeftForUserToken;
    //чтобы избежать проблем
    //когда таймер вызывается по нескольку раз
    //тогда когда не надо
    //нужна эта перемена
    private subscribedToTimer = false;
    //переменная в которой хранится
    //результат метода subscribe
    //который вызывается у таймера
    private logoutSubscription : Subscription | undefined;

    constructor(
            private userCookieService : UserCookieService, 
            private http: HttpClient, 
            @Inject("BASE_URL") baseUrl : string,  
            @Inject('USER_TOKEN_LIFE_TIME')  private tokenLifeTime : number
        ){
        //вообщем эта переменная 
        //дает возможность
        //объединить три источника данных в один
        //чтобы обрабатывать их изменения в одном методе subscribe
        this.authorizedUserData = zip(this.authorizedUserLogin, this.authorizedUserEmail, this.authorizedUserToken);
        //путь к бэку где проверяется валдиность токена
        this.validateTokenUrl = baseUrl + "user/validatetoken/";
        //1000 мс * 60с = 1 мин
        //далее та самая 1мин помножается на их количество в конфиге
        this.timeLeftForUserToken =  1000 * 60 * this.tokenLifeTime;
        //иницализация таймера
        this.logOutTimer = timer(this.timeLeftForUserToken);
    }


    //вызывется при смене логина пользователя
    setLoginAsEvent(login : string | undefined) {
        this.userLoginSub$.next(login)
    }
    //вызывается при сменен почты пользователя
    setEmailAsEvent(email : string | undefined)
    {
        this.userEmailSub$.next(email);
    }
    //вызывается при смене токена пользователя
    //на самом деле нигде не используется
    //в логике нигде не учавсвтует
    //нужент лишь из-за моего перфекционизма
    setTokenAsEvent(token : string | undefined)
    {
        this.userTokenSub$.next(token);
    }
    //метод которым сразу можно вызвать выше упомянутые методы
    setAllUserDataAsEvent(login : string | undefined, email : string | undefined, token : string | undefined)
    {   
        this.setLoginAsEvent(login);
        this.setEmailAsEvent(email);
        //данный вызов ни на что в текущий момент
        //ни на что не влияет
        this.setTokenAsEvent(token);
    }

    //как умпонилось выше
    //есть нежелательные повторные вызовы таймера
    //а есть необхомдимые
    //для того чтобы контролировать повторные вызовы таймера
    //нужна переменная recoverTimer
    logoutWhenTokenExpired(recoverTimer : boolean = false)
    {
        //если таймер нигде не вызывался
        //или если нужно повторно вызывать таймер
        if(!this.subscribedToTimer || recoverTimer)
        {
            //перед запуском таймера
            //в поле записывается что он вызывался
            this.subscribedToTimer = true;
            
            //нужно сохранить подписку чтобы ее можно было убрать
            this.logoutSubscription = this.logOutTimer.subscribe(() => {
                //вызов логаунта
                this.logoutAndSendEvent();

                //после окончания работы таймера
                //обратно ставится что он свободен
                this.subscribedToTimer = false;
            });
        }
        //возврат подписки
        //чтобы можно было отписаться от таймера
        //переменная подписки используется
        //лишь внутри этого класса
        return this.logoutSubscription;
        
    }

    //проверка валидности текущего токена
    //в tokenIsValid записывается результат метода tokenChecker
    checkCurrentToken(tokenChecker:(tokenIsValid: boolean) => void)
    {
        let currentUserToken = this.userCookieService.getJwtToken();
        this.http.get(this.validateTokenUrl, {params: {token: currentUserToken} }).subscribe({
            next:()=>{
                tokenChecker(true);//токен валидный
            },
            error:() =>{
                tokenChecker(false);//токен невалидный
            }
        });
    }

    //снова к объединению трех источнику данных
    //на вход подается функция где можно прочитать изменения переменных
    //здесь используется паттер адаптер
    subscribeToUserData(subscribe : (login : string | undefined, email : string | undefined, token : string | undefined) => void)
    {
        //подписка на изменений login, email, token
        this.authorizedUserData.subscribe(([login, email, token]) => {
            subscribe(login, email, token);
        })
    }

    //подписка лишь на изменения логина
    subscribeToLogin(subscribe : (login : string | undefined) => void) {
        this.authorizedUserLogin.subscribe(subscribe);
    }
    //подписка лишь на изменения почты
    subscirbeToEmail(subscribe : (email : string | undefined) => void)
    {
        this.authorizedUserEmail.subscribe(subscribe);
    }
    //подписка лишь на изменения токена(нигде не юзается)
    subscribeToToken(subscribe : (token : string | undefined) => void)
    {
        this.authorizedUserToken.subscribe(subscribe);
    }
    //подписка на событие логаута
    subscribeToLogout(subscribe:()=>void){
        this.userLogoutObs.subscribe(subscribe);
    }
    //авторизация
    authorizeAndSendEvent(token : string, login : string, email : string)
    {
        //хоть и метод называется authorize
        //но лишь записываются данные в куки
        this.userCookieService.authorize(login, token, email);
        //вызов событий на изменения login, email, token
        this.setAllUserDataAsEvent(login, email, token);
        //запуск таймера логаута
        this.logoutWhenTokenExpired(true);
    }

    //отвечает за лоаут
    logoutAndSendEvent()
    {
        //чистим все куки
        this.userCookieService.clearAllUsersCookie();
        //посывалаем события на изменения текущего логина
        //но так как логаут то везде отсылается undefined
        this.setAllUserDataAsEvent(undefined, undefined, undefined);
        //вызов события  логаута
        this.userLogout$.next(undefined);

        //данная проверка и вызов unsubscribe нужны
        //чтобы избежать моментов, когда пытаются 
        //выйти из акаунта из которого уже вышли
        if(this.logoutSubscription !== undefined)
            this.logoutSubscription.unsubscribe();
    }
      
}