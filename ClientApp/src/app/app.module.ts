import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UserCookieService } from './core/user/user-cookie.service';
import { SharedModule } from './shared/shared.module';
import { UserService } from './core/user/user.service';
import { NavMenuComponent } from './pages/nav-menu/nav-menu.component';
import { AuthorizeUserService } from './core/authorize/authorize-user.service';
import { ChangeUserDataService } from './core/home/change-data-user.service';
import { UserRegisterService } from './core/register/userRegisterService';
import { AppRoutingModule } from './app-routing.module';
import { httpInterceptorProviders } from './core/http/http-interceptors-providers';
import { HttpService } from './core/http/http.serivce';
import { BearerTokenInterceptor } from './core/http/interceptors/bearer-token.interceptor';
import { SetDefaultUrlInterceptor } from './core/http/interceptors/set-default-url.interceptor';




@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [SetDefaultUrlInterceptor, BearerTokenInterceptor,  {provide: HttpClient, useClass: HttpService},
     UserService, UserCookieService, AuthorizeUserService, ChangeUserDataService, UserRegisterService],
  bootstrap: [AppComponent]
})
export class AppModule {}
