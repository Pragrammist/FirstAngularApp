import { RouterModule, Routes } from "@angular/router";

import { NgModule } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { SecretStashComponent } from "./secret-stash/secret-stash.component";
import { GoalsComponent } from "./goals/goals.component";
import { AchievementsComponent } from "./achievements/achievements.component";

const routes: Routes = [
    { path: '', component: HomeComponent, },
    { path: 'secret-stash', component: SecretStashComponent, },
    { path: 'goals', component: GoalsComponent, },
    { path: 'achievments', component: AchievementsComponent, },
    
  ];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MainRoutingModule{}