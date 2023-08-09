import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { AuthorizeComponent } from './authorize/authorize.component';


@NgModule({
  declarations: [
    RegisterComponent,
    AuthorizeComponent
  ],
  exports:[
    RegisterComponent,
    AuthorizeComponent
  ],
  imports: [
    CommonModule,
 
    FormsModule,
    RegisterRoutingModule
  ]
})
export class AuthModule { }
