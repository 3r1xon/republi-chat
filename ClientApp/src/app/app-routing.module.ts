import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserService } from 'src/services/user.service';

import { PLoginComponent } from './pages/p-login/p-login.component';
import { PMainpageComponent } from './pages/p-mainpage/p-mainpage.component';
import { PSettingsComponent } from './pages/p-settings/p-main/p-main.component';
import { PPrivacyComponent } from './pages/p-settings/p-privacy/p-privacy.component';
import { PProfileComponent } from './pages/p-settings/p-profile/p-profile.component';
import { PSignupComponent } from './pages/p-signup/p-signup.component';
import { PUnauthorizedComponent } from './pages/p-unauthorized/p-unauthorized.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: PSignupComponent, pathMatch: 'full' },
  { path: 'login', component: PLoginComponent, pathMatch: 'full' },
  { path: 'mainpage', component: PMainpageComponent, pathMatch: 'full', canActivate: [UserService] },
  { path: 'unauthorized', component: PUnauthorizedComponent, pathMatch: 'full', canActivate: [UserService] },
  { 
    path: 'settings',
    component: PSettingsComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: PProfileComponent, pathMatch: 'full' },
      { path: 'privacy', component: PPrivacyComponent, pathMatch: 'full' }
    ],
    canActivate: [UserService] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
