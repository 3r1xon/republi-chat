import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { LoginComponent } from './login/login.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { SettingsComponent } from './settings/main-settings/settings.component';
import { PrivacyComponent } from './settings/privacy/privacy.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'mainpage', component: MainpageComponent, pathMatch: 'full', canActivate: [UserService] },
  { 
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent, pathMatch: 'full' },
      { path: 'privacy', component: PrivacyComponent, pathMatch: 'full' }
    ],
    canActivate: [UserService] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
