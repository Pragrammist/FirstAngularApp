import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { redirectOnLogin } from './core/guards/redirect-on-login.guard';
import { redirectOnLogout } from './core/guards/regirect-on-logout.guard';



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
