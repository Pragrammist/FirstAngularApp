import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "src/app/app.component";
import { HomeComponent } from "./home/home.component";
import { MainRoutingModule } from "./main-routing.module";
import { CommonModule } from "@angular/common";
import { SecretStashComponent } from './secret-stash/secret-stash.component';
import { GoalsComponent } from './goals/goals.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { mainHttpInterceptorProviders } from "./main-http-interceptors-providers";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "../../shared/shared.module";


@NgModule({
    //providers: [mainHttpInterceptorProviders], не влияет ни как
    declarations: [HomeComponent, SecretStashComponent, GoalsComponent, AchievementsComponent],
    exports: [HomeComponent],
    bootstrap: [AppComponent],
    imports: [FormsModule, MainRoutingModule, CommonModule, SharedModule]
})
export class MainModule{}