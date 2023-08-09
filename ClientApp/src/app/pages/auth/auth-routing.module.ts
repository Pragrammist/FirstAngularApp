import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { AuthorizeComponent } from './authorize/authorize.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'authorize', component: AuthorizeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
