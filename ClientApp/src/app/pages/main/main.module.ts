import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "src/app/app.component";
import { HomeComponent } from "./home/home.component";
import { MainRoutingModule } from "./main-routing.module";
import { CommonModule } from "@angular/common";
import { SecretStashComponent } from './secret-stash/secret-stash.component';
import { GoalsComponent } from './goals/goals.component';
import { AchievementsComponent } from './achievements/achievements.component';


@NgModule({
    imports: [FormsModule, MainRoutingModule, CommonModule],
    declarations: [ HomeComponent, SecretStashComponent, GoalsComponent, AchievementsComponent],
    exports: [ HomeComponent],
    bootstrap: [AppComponent],       // экспортируем компонент
})
export class MainModule{}