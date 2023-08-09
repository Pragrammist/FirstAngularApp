import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/auth.guard';
import { redirectOnLogout } from './shared/regirect-on-logout.guard';
import { redirectOnLogin } from './shared/redirect-on-login.guard';


const routes :Routes = [
  {
    path: '', redirectTo: 'main', pathMatch:'full'
  },
  { path: '', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule), canActivate:[redirectOnLogin] },
  { path: 'main', loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule), canActivate: [authGuard, redirectOnLogout],},
  
  
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
